<template>
  <div>
    <h1>login</h1>
    <router-link :to="{ path: '/home' }">
      toHome
    </router-link>

    <p v-for="item in items">
      {item}
    </p>
  </div>
</template>

<script>
export default {
    data () {
        return {
            items: Array(1000),
        }
    },
    mounted () {
        window.addEventListener('scroll', function (e) {
            console.info(e)
        })
    },
}
</script>
