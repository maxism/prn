#!/bin/bash
set -e

domains=(c-cube.ru suite.c-cube.ru)
rsa_key_size=4096
data_path="./certbot"
email="fillo.napkin@gmail.com"   # email для уведомлений Let's Encrypt, поменяй если нужен другой
staging=0  # 1 = тестовые сертификаты Let's Encrypt (не бьют по лимитам), 0 = боевые

if ! command -v docker &> /dev/null; then
  echo "docker не найден, установи docker и docker compose" >&2
  exit 1
fi

for domain in "${domains[@]}"; do
  echo "### Создаю временный самоподписанный сертификат для $domain ..."
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$data_path/conf/live/$domain"
  docker compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
      -keyout '$path/privkey.pem' \
      -out '$path/fullchain.pem' \
      -subj '/CN=localhost'" certbot
  echo
done

echo "### Запускаю nginx ..."
docker compose up --force-recreate -d nginx
echo

for domain in "${domains[@]}"; do
  echo "### Удаляю временный сертификат для $domain ..."
  docker compose run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
  echo
done

case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

if [ "$staging" != "0" ]; then staging_arg="--staging"; fi

failed_domains=()
for domain in "${domains[@]}"; do
  echo "### Запрашиваю боевой сертификат Let's Encrypt для $domain ..."
  set +e
  docker compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      $staging_arg \
      $email_arg \
      -d $domain \
      --rsa-key-size $rsa_key_size \
      --agree-tos \
      --force-renewal" certbot
  if [ $? -ne 0 ]; then
    failed_domains+=("$domain")
    echo "!!! Не удалось получить сертификат для $domain, продолжаю со следующим доменом"
  fi
  set -e
  echo
done

echo "### Перезагружаю nginx ..."
docker compose exec nginx nginx -s reload

if [ ${#failed_domains[@]} -ne 0 ]; then
  echo
  echo "!!! Не получили сертификаты для: ${failed_domains[*]}"
  echo "!!! Для этих доменов nginx работает на временном самоподписанном сертификате."
  exit 1
fi
