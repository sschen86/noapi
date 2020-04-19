<template>
  <i class="svg-icon anticon" :class="className">
    <svg aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
  </i>
</template>

<script>
export default {
    name: 'SvgIcon',
    props: {
        type: { // 图标类型，等于图标文件名称
            type: String,
            required: true,
        },
        className: { // 自定义的className
            type: String,
            default: '',
        },
    },
    computed: {
        iconName () {
            return `#icon-${this.type}`
        },
    },
    methods: {
        anticon () {},
    },
}
</script>

<style lang="less">
.svg-icon {
  display: inline-block;
  font-style: normal;
  vertical-align: -0.125em;
  text-align: center;
  text-transform: none;
  line-height: 0;
  text-rendering: optimizeLegibility;
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>
