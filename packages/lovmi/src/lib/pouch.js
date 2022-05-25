import { PouchDB, find, liveFind } from "@svouch/pouchdb"

PouchDB.plugin(find)
PouchDB.plugin(liveFind)

export default PouchDB
