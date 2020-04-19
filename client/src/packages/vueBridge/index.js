module.exports = bridge

function bridge (option) {
    const events = option.events || {}
    const bridge = {
        $vm: option.vm,
        ...option.state,
        ...option.methods,
        $append (option) {
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

class Bridge {
    constructor (option) {
        this.$globals = option.globals
        this.$parent = option.parent || null
        this.$vm = null
        this._events = option.events || {}

        Object.assign(this, option.state, option.methods)
    }

    $append (option) {
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
        for (const key in fields) {
            const sourceKey = fields[key] === true ? key : fields[key]
            props[key] = {
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
        Object.defineProperties(this.$vm, props)
    }
}
