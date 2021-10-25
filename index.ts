import { initDB } from './src/initDB'
import PouchDB from 'pouchdb'
import PouchFind from 'pouchdb-find'
import { config } from './src/Config'
import { v4 as uuid } from 'uuid'
PouchDB.plugin(PouchFind)

async function main() {
  let db
  try {
    db = await initDB(config)
  } catch (err) {
    console.error(err)
    return 1
  }

  const info = await db.info()
  console.log(info)

  const docs: PouchDB.Core.PutDocument<{ internalID: string }>[] = [
    {
      _id: uuid(),
      internalID: '1234',
    },
    {
      _id: uuid(),
      internalID: '5678',
    },
    {
      _id: uuid(),
      internalID: '0987',
    },
  ]

  console.log(
    `New documents: ${docs.map((e) => {
      return JSON.stringify(e)
    })}`
  )

  const internalIDs = docs.map((d) => {
    return d.internalID
  })

  const queryResult = await db.query('myIndex/myView', {
    keys: internalIDs,
  })

  const updateMeta = queryResult.rows.map((r) => {
    return { internalID: r.key, uuid: r.id, rev: r.value }
  })

  const updateMetaMap = new Map<string, { uuid: string; rev: string }>(
    updateMeta.map((d) => {
      return [d.internalID, { uuid: d.uuid, rev: d.rev }]
    })
  )

  console.log(`Query results: ${JSON.stringify(queryResult)}`)
  console.log(
    `Update Metadata: ${updateMeta.map((e) => {
      return JSON.stringify(e)
    })}`
  )

  for (const d of docs) {
    const i = updateMetaMap.get(d.internalID)
    if (i !== undefined) {
      d._id = i.uuid
      d._rev = i.rev
    }
  }

  console.log(
    `Updated Docs: ${docs.map((e) => {
      return JSON.stringify(e)
    })}`
  )

  await db.bulkDocs(docs)

  return 0
}

main()
