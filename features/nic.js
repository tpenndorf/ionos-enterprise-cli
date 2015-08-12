var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processNic

function processNic(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error("DataCenter Id is a required field.")
        process.exit(code = 5)
    }
    if (!params.serverid || params.serverid == true) {
        console.error("Server Id is a required field.")
        process.exit(code = 5)
    }

    switch (params.nic) {
        case 'list':
            pbclient.listNics(params.datacenterid, params.serverid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getNic(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        case 'create':
            createNic(params)
            break
        case 'update':
            updateNic(params)
            break
        case 'delete':
            if (!global.force) {
                console.log('You are about to delete a snapshot. Do you want to proceed? (y/n')
                prompt.get(['yes'], function (err, result) {
                    if (result.yes == 'yes' || result.yes == 'y')
                        pbclient.deleteNic(params.datacenterid, params.serverid, params.id, helpers.printInfo)
                    else
                        process.exit(code = 0)
                })
            }
            else
                pbclient.deleteNic(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createNic(params) {

    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        }
        else {
            data.properties = {}
            data.properties.name = params.name
            if(params.ip)
                data.properties.ips = [params.ip]
            data.properties.dhcp = params.dhcp
            if (params.lan)
                data.properties.lan = params.lan
            else {
                console.error("LAN is a required field.")
                process.exit(code = 5)
            }
        }
    }
    finally {
        pbclient.createNic(params.datacenterid, params.serverid, data, helpers.printInfo)
    }
}

function updateNic(params) {
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        }
        else {
            data.properties = {}
            if (params.name)
                data.properties.name = params.name
            if (params.ip)
                data.properties.ips = [params.ip]
            if (params.dhcp)
                data.properties.dhcp = params.dhcp
            if (params.lan)
                data.properties.lan = params.lan

        }
    }
    finally {
        pbclient.patchNic(params.datacenterid, params.serverid, data, helpers.printInfo)
    }

}