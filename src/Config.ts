import { parse } from 'ts-command-line-args'

export type MyArgs = {
  couchUser: string
  couchPassword: string
  couchURL: string
  configFile?: string
  help?: boolean
}

export const config = parse<MyArgs>(
  {
    couchUser: String,
    couchPassword: String,
    couchURL: String,
    configFile: { type: String, optional: true, alias: 'c', description: 'Configuration file' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
  },
  {
    loadFromFileArg: 'configFile',
    helpArg: 'help',
    headerContentSections: [
      {
        header: "I don't know how to name this application.",
        content: `\nThis is an example of using CouchDB with TypeScript and Node.\n
                \n
                  Usage:
                  1) go to preject directory:
                    \$ cd path\/to\/ts-node-couch-base
                  2) create a config file \"etc\/config.json\" like this:
                  \\{
                      \"couchUser\": \"john\",
                      \"couchPassword\": \"c43n30fnq0c4n03\",
                      \"couchURL\": \"127.0.0.1\/my-awsome-db\"
                  \\}
                  3) install dependencies
                    \$ npm install
                  4) build
                    \$ npm run build
                  5) run
                    \$ node . -c etc\/config.json

                  Requires: node v14.17.6 (npm v6.14.15)`,
      },
    ],
    footerContentSections: [
      { header: 'Provided to you by:', content: 'Luca Mazzon' },
      { header: 'Licence', content: 'GNU General Public License v3.0' },
    ],
  }
)

export default config
