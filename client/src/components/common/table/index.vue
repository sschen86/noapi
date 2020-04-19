<script>
export default {
    name: 'CTable',
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    data () {
        const tabItems = []
        const tabParams = {}
        if (this.option.tabs) {
            this.formatTabItems(this.option.tabs.items).forEach(item => {
                tabItems.push({
                    label: item.label,
                    labelText: item.label,
                    key: item.key,
                })
            })

            tabParams[this.option.tabs.name] = this.option.tabs.defaultActiveKey || ''

            this.option.tabs.updateLabel = option => {
                this.tabItems.forEach(item => {
                    if (item.key in option) {
                        const value = option[item.key]

                        // 更新label文案
                        if (typeof value === 'function') {
                            item.labelText = value(item)
                        }
                    }
                })
            }
        }

        return {
            title: this.option.title || '',
            bordered: this.option.bordered !== false,
            loading: false,
            rowKey: this.option.rowKey || ((record, index) => index),
            columns: this.formatColumns(this.option.columns),
            dataSource: [],
            pagination: {
                pageSizeOptions: [ '20', '50', '100' ],
                position: 'bottom',
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: total => this.option.showTotal ? `总共 ${total} 条` : '',
                ...(this.option.defaultPagination || { pageSize: 20, current: 1 }),
                onChange: current => (this.pagination.current = current),
                onShowSizeChange: (current, pageSize) =>
                    (this.pagination.pageSize = pageSize),
            },
            rowSelection: this.option.rowSelection || null,
            tabItems,
            tabParams,
            defaultActiveKey: this.option.tabs ? this.option.tabs.defaultActiveKey : '',
            scrollX: this.option.scrollX || true,
            scrollY: this.option.scrollY || false,
            nowScrollY: false,
            paginationIsMerge: false,
        }
    },
    created () {
        this.option.params = {}
        this.option.reload = () => this.dataUpdate()
        this.dataUpdate()
    },
    mounted () {
        this.adjustPaginationPosition()
        this.resizeTableHeight()
    },

    methods: {
        dataUpdate () {
            this.loading = true

            const result = this.option.dataSource(this.option.params = {
                ...this.tabParams,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            })

            const success = (res) => {
                this.pagination.current = res.page
                this.pagination.total = res.total
                this.dataSource = res.data
                this.loading = false
            }
            const error = () => {
                this.loading = false
            }

            if (result instanceof Promise) {
                return result.then(success).catch(error)
            }

            // 直接返回的是数据
            if (result) {
                return success(result)
            }

            error()
        },

        onTabChange (key) {
            this.tabParams[this.option.tabs.name] = key
            this.dataUpdate()
        },

        // 对tab.items的参数进行简化
        formatTabItems (items) {
            return items.map(item => {
                if (Array.isArray(item)) {
                    return {
                        label: item[0],
                        key: item[1],
                    }
                }
                return item
            })
        },

        // 对columns进行一些处理，用来支持简化传入参数的格式
        formatColumns (columns) {
            return columns.map(item => {
                if (Array.isArray(item)) {
                    let column = { title: item[0] }
                    if (item[1]) {
                        column.dataIndex = item[1]
                    }
                    if (item[2]) {
                        column = { ...column, ...item[2] }
                    }
                    return column
                }
                return item
            })
        },

        // 分页对齐操作
        adjustPaginationPosition () {
            if (!this.option.tabs) {
                return
            }
            setTimeout(() => {
                const dataView = this.$refs.dataView.$el
                const tabBox = dataView.querySelector('.ant-tabs-nav')
                const fullWidth = tabBox.parentNode.offsetWidth
                const tabBoxWidth = tabBox.offsetWidth
                const paginationWidth = 690
                this.paginationIsMerge = tabBoxWidth + paginationWidth < fullWidth - 20
            })
        },

        // 调整表格高度
        resizeTableHeight () {
            // 自适应高度
            if (this.scrollY === 'auto') {
                setTimeout(() => {
                    const windowHeight = window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight
                    this.nowScrollY = Math.max(windowHeight - this.$refs.table.$el.getBoundingClientRect().top - 165, 480)
                })
                return
            }

            // 固定高度
            if (this.scrollY > 0) {
                this.nowScrollY = this.scrollY
            }
        },
    },
    render () {
        const scroll = { x: this.scrollX, y: this.nowScrollY ? this.nowScrollY : false }
        return (
            <a-card class="common-table" ref="common-table" title={this.title || ''}>
                {this.$slots.operateBar}
                {this.tabItems.length > 0 ? (
                    <a-tabs onChange={this.onTabChange} type="card" defaultActiveKey={this.defaultActiveKey}>
                        {this.tabItems.map(item => {
                            return <a-tab-pane tab={item.labelText} key={item.key} />
                        })}
                    </a-tabs>
                ) : (
                    ''
                )}

                <a-table
                    class={this.paginationIsMerge ? 'tabbox-pagination-merge' : ''}
                    ref="table"
                    {...{ scopedSlots: { ...this.$scopedSlots } }}
                    columns={this.columns}
                    rowKey={this.rowKey}
                    dataSource={this.dataSource}
                    pagination={{ ...this.pagination }}
                    loading={this.loading}
                    onChange={this.dataUpdate}
                    rowSelection={this.rowSelection}
                    bordered={this.bordered}
                    locale={{ emptyText: '没有相关的数据' }}
                    scroll={ scroll }
                >
                    {Object.keys(this.$slots).map(name => (
                        <template slot={name}>{this.$slots[name]}</template>
                    ))}
                </a-table>
            </a-card>
        )
    },
}
</script>

<style lang="less">
.common-table {
    .tabbox-pagination-merge {
        .ant-table-pagination {
            margin-top: -55px;
        }
    }

    .ant-table-thead th,
    .ant-table-tbody td {
        .buttons-inline {
            .ant-btn {
                margin-right: 8px;
            }
        }

        .buttons-break {
            margin-bottom: -8px;

            .ant-btn {
                display: block;
                margin: 0 auto 8px;
            }
        }
    }
}
</style>
