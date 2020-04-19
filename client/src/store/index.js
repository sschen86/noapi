import vueStateStorage from '../packages/vueStateStorage'
import app from './app'
import user from './user'

export default vueStateStorage({
    modules: { app, user },
})
