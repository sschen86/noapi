module.exports = {
    create,
    listen,
    send,
    leave,
}

class Bridge {
    constructor (option) {
        this.$globals = option.globals
        this.$parent = option.parent || null
        this.$vm = null
        this._events = option.events || {}

        Object.assign(this, option.state, option.methods)
    }

    $connect (option) {
        return new Bridge({
            ...option,
            parent: this,
            globals: this.$globals,
        })
    }

    $bind (vm) {
        this.$vm = vm
    }

    $exports (methods) {
        Object.assign(this, methods)
    }

    $emit (type, ...args) {
        const event = this._events[type]
        let stopPropagation = false
        if (event) {
            stopPropagation = event.apply(this, args) === false
        }
        if (this.$parent && !stopPropagation) {
            this.$parent.$emit(type, ...args)
        }
    }

    $mapState (fields) {
        const props = {}
        const pushState = (targetKey, sourceKey) => {
            props[targetKey] = {
                get: () => {
                    return sourceKey in this ? this[sourceKey] : this.$globals[sourceKey]
                },
                set: (value) => {
                    if (sourceKey in this) {
                        this[sourceKey] = value
                    } else {
                        this.$globals[sourceKey] = value
                    }
                },
            }
        }

        if (Array.isArray(fields)) {
            fields.forEach(field => {
                if (typeof field === 'string') {
                    pushState(field, field)
                } else {
                    for (const key in field) {
                        pushState(key, field[key])
                    }
                }
            })
        } else {
            for (const key in fields) {
                pushState(key, fields[key] === true ? key : fields[key])
            }
        }

        Object.defineProperties(this.$vm, props)
    }
}

function create (option) {
    const events = option.events || {}
    const bridge = {
        $vm: option.vm,
        ...option.state,
        ...option.methods,
        $connect (option) {
            return new Bridge({
                ...option,
                parent: bridge,
                globals: bridge,
            })
        },
        $emit (type, ...args) {
            events[type] && events[type].apply(bridge, args)
        },
        $mapState: Bridge.prototype.$mapState,
    }
    bridge.$globals = bridge
    return bridge
}

const events = {}

function listen (type, handler, who) {
    if (!events[type]) {
        events[type] = []
    }
    events[type].push({ who, handler })
}

function send (type) {
    const args = [ ...arguments ].slice(1)
    const queue = events[type]
    if (queue) {
        queue.forEach(item => item.handler.apply(this, args))
    }
}

function leave (who) {
    for (const type in events) {
        const queue = events[type]
        if (queue.length > 0) {
            events[type] = queue.filter(item => item.who !== who)
        }
    }
}
