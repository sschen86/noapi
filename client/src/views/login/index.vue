<template>
  <div>
    <h1>login</h1>
    <p>{{ tips }}</p>
  </div>
</template>

<script>
export default {
    data () {
        return {
            tips: '账号登录中...',
        }
    },
    mounted () {
        this.$api.login({ user: 'admin', password: '123456' }, (data) => {
            console.info({ data })
        })
    },
}
</script>
