import PouchDB from 'pouchdb'
import { MyArgs } from './Config'

export async function initDB(config: MyArgs) {
  const db = new PouchDB<{}>(`http://${config.couchUser}:${config.couchPassword}@${config.couchURL}`)

  // The map function is a JavaScript function in string format
  // We can't write it in strict mode TypeScript
  const internalIDtoUUIDAndRev = {
    _id: '_design/myIndex',
    views: {
      myView: {
        map: `function (doc) {
          emit(doc.internalID, doc._rev);
        }`,
      },
    },
  }

  try {
    await db.put(internalIDtoUUIDAndRev)
  } catch (err: any) {
    if (err.error !== undefined && err.error === 'conflict') {
      console.info(`Design Document with id ${err.docId} already exists. Skipping.`)
    } else {
      console.error(`Error while adding design doc to PouchDB: ${err}; ${JSON.stringify(err)}`)
      throw err
    }
  }
  return db
}
