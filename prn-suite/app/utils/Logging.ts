import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple()
      )
    })
  ]
})

function formatArgs (args: IArguments): any {
  // @ts-ignore
  return [util.format.apply(util.format, Array.prototype.slice.call(args))]
}

console.log = function (): void {
  logger.info.apply(logger, formatArgs(arguments))
}
console.info = function (): void {
  logger.info.apply(logger, formatArgs(arguments))
}
console.warn = function (): void {
  logger.warn.apply(logger, formatArgs(arguments))
}
console.error = function (): void {
  logger.error.apply(logger, formatArgs(arguments))
}
console.debug = function (): void {
  logger.debug.apply(logger, formatArgs(arguments))
}
