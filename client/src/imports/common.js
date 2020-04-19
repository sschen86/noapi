import Vue from 'vue'
// import Card from '@/components/widgets/card'
// import DataFilter from '@/components/widgets/data-filter'
// import DataView from '@/components/widgets/data-view'
import Form from '../components/common/form'
import Dialog from '../components/common/dialog'
// import AreaPicker from '@/components/widgets/area-picker'
// import OperateBar from '@/components/widgets/operate-bar'

import Table from '../components/common/table'

const components = {
    Form, Table, Dialog,
    // Card, DataFilter, DataView, Form, Dialog, AreaPicker, OperateBar,
}

for (const name in components) {
    Vue.component(`c${name.replace(/([A-Z])/g, (match, letter) => `-${letter.toLowerCase()}`)}`, components[name])
}
