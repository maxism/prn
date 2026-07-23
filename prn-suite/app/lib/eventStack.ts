import _ from 'lodash'

class EventStack {
  _handlers = {}
  _pools = {}

  // ------------------------------------
  // Utils
  // ------------------------------------

  _emit = name => (event) => {
    _.forEach(this._pools, (pool, poolName) => {
      const { [name]: handlers } = pool

      if (!handlers) return
      if (poolName === 'default') {
        // @ts-ignore
        _.forEach(handlers, handler => handler(event))
        return
      }
      // @ts-ignore
      _.last(handlers)(event)
    })
  }

  _normalize = handlers => (_.isArray(handlers) ? handlers : [handlers])

  // ------------------------------------
  // Listeners handling
  // ------------------------------------

  _listen = (name: string) => {
    if (_.has(this._handlers, name)) return
    const handler = this._emit(name)

    if (name === 'resize') window.addEventListener(name, handler)
    if (name === 'scroll') window.addEventListener(name, handler)
    else document.addEventListener(name, handler)
    this._handlers[name] = handler
  }

  _unlisten = (name: string) => {
    if (_.some(this._pools, name)) return
    // @ts-ignore
    const { [name]: handler } = this._handlers

    if (name === 'resize') window.removeEventListener(name, handler)
    if (name === 'scroll') window.removeEventListener(name, handler)
    else document.removeEventListener(name, handler)
    delete this._handlers[name]
  }

  // ------------------------------------
  // Pub/sub/emit
  // ------------------------------------

  sub = (name, handlers, pool = 'default', pool_id = '') => {
    const events = _.uniq([
      ..._.get(this._pools, `${pool}${pool_id}.${name}`, []),
      ...this._normalize(handlers)
    ])

    this._listen(name)
    _.set(this._pools, `${pool}${pool_id}.${name}`, events)
  }

  unsub = (name, handlers, pool = 'default', pool_id = '') => {
    const events = _.without(
      _.get(this._pools, `${pool}${pool_id}.${name}`, []),
      ...this._normalize(handlers)
    )

    if (events.length > 0) {
      _.set(this._pools, `${pool}${pool_id}.${name}`, events)
      return
    }

    _.set(this._pools, `${pool}${pool_id}.${name}`, undefined)
    this._unlisten(name)
  }

  emit = (name, value = null) => {
    this._emit(name)(value)
  }
}

const instance = new EventStack()

export default instance
