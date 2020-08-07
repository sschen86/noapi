import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db = null
let dbpath = './database/data2.db'

export function config ({ DB_PATH }) {
    DB_PATH && (dbpath = DB_PATH)
}

async function getDb () {
    return db || (db = await open({
        filename: dbpath,
        driver: sqlite3.Database,
    }))
}

export async function get () {
    return (await getDb()).get(...arguments)
}

export async function all () {
    return (await getDb()).all(...arguments)
}

export async function run () {
    return (await getDb()).run(...arguments)
}

export async function exec () {
    return (await getDb()).exec(...arguments)
}

export async function close () {
    return (await getDb()).close()
}


export async function insert (tableName, data) {
    const keys = []
    const values = []
    for (const key in data) {
        const value = data[key]
        if (value == null) {
            continue
        }

        keys.push(uncamelize(key))
        values.push((slqValue(value)))
    }

    const sqlExpression = `
        INSERT INTO ${tableName}(${keys.join(',')})
        VALUES (${values.join(',')})
    `

    // console.info({ title: 'insert', sqlExpression })

    return await run(sqlExpression)
}


/// UPDATE table_name
/// SET column1 = value1, column2 = value2...., columnN = valueN
/// WHERE [condition];
export async function update (tableName, data, condition = '') {
    const sets = []
    for (const key in data) {
        if (data[key] === undefined) {
            continue
        }
        sets.push(`${uncamelize(key)}=${slqValue(data[key])}`)
    }
    if (sets.length === 0) {
        return
    }
    const sqlExpression = `
        UPDATE ${tableName} SET ${sets.join(',')}
        ${condition}
   `
    // console.info({ sqlExpression })

    await run(sqlExpression)
}

// 驼峰转下划线
function uncamelize (str) {
    return str
    // return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

// 处理sql值
function slqValue (value) {
    if (value === null) {
        return 'NULL'
    }

    const type = typeof value
    if (type === 'string') {
        return `'${value.replace(/'/g, '\'\'')}'`
    }

    if (type === 'number') {
        return value
    }
}


/* 创建接口表
exec(`
CREATE TABLE api(
    id      INTEGER          PRIMARY KEY    AUTOINCREMENT  NOT NULL,
    path    CHAR(128)                   NOT NULL UNIQUE,
    name    CHAR(64)                    NOT NULL UNIQUE,
    method  INTEGER                         DEFAULT 1,
    req_context_type  INTEGER               DEFAULT 1,
    request     CHAR,
    response    CHAR,
    category_id    INTEGER
)
 `).then(function (resultq) {
    console.info({ resultq })
}).catch(error1 => {
    console.info({ error1 })
})

*/

/* 创建分类表
exec(`
CREATE TABLE category(
    id      INTEGER          PRIMARY KEY    AUTOINCREMENT  NOT NULL,
    label    CHAR(64)                    NOT NULL UNIQUE,
    parent_id  INTEGER
)
 `).then(function (resultq) {
    console.info({ resultq })
}).catch(error1 => {
    console.info({ error1 })
})

*/
/* 插入接口数据
run(`
    INSERT INTO api(path, name)
    VALUES ('path2', 'name2')
`).then(r => {
    console.info({ r })
}).catch(error11 => {
    console.info({ error11 })
})
*/


/*
get('SELECT * FROM api').then(function (result2) {
    console.info({ result2 })
}).catch(error2 => {
    console.info({ error2 })
})
*/
