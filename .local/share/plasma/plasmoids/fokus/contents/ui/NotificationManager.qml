import QtQuick 2.0
import org.kde.plasma.core 2.0 as PlasmaCore
import QtMultimedia 5.4

QtObject {
    id: notificationManager

    property var dataSource: PlasmaCore.DataSource {
        id: dataSource
        engine: "notifications"
        connectedSources: "org.freedesktop.Notifications"
    }

    function start(args) {
        switch (args) {
        case 1:
        case 3:
        case 5:
        case 7:
            createNotification({
                                   "appName": "fokus",
                                   "appIcon": "chronometer-start",
                                   "summary": "Focus on your work!",
                                   "soundFile": plasmoid.configuration.timer_start_sfx_enabled ? plasmoid.configuration.timer_start_sfx_filepath : undefined
                               })
            break
        case 2:
        case 4:
        case 6:
            createNotification({
                                   "appName": "fokus",
                                   "appIcon": "chronometer-start",
                                   "summary": "Go for a walk.",
                                   "soundFile": plasmoid.configuration.timer_start_sfx_enabled ? plasmoid.configuration.timer_start_sfx_filepath : undefined
                               })
            break
        case 8:
            createNotification({
                                   "appName": "fokus",
                                   "appIcon": "chronometer-start",
                                   "summary": "Take a long break!",
                                   "soundFile": plasmoid.configuration.timer_start_sfx_enabled ? plasmoid.configuration.timer_start_sfx_filepath : undefined
                               })
            break
        }
    }

    function end(args) {
        switch (args) {
        case 1:
        case 3:
        case 5:
        case 7:
            createNotification({
                               "appName": "fokus",
                               "appIcon": "chronometer",
                               "summary": "End of focus time.",
                               "soundFile": plasmoid.configuration.timer_stop_sfx_enabled ? plasmoid.configuration.timer_stop_sfx_filepath : undefined
                           })
            break
        case 2:
        case 4:
        case 8:
        case 6:
            createNotification({
                               "appName": "fokus",
                               "appIcon": "chronometer",
                               "summary": "End of break.",
                               "soundFile": plasmoid.configuration.timer_stop_sfx_enabled ? plasmoid.configuration.timer_stop_sfx_filepath : undefined
                           })
            break
        }
    }

    function stop(args) {
        createNotification({
                               "appName": "fokus",
                               "appIcon": "chronometer",
                               "summary": "Stop",
                               "body": "Session stopped."
                           })
    }

    function createNotification(args) {
        // https://github.com/KDE/plasma-workspace/blob/master/dataengines/notifications/notifications.operations
        var service = dataSource.serviceForSource("notification")
        var operation = service.operationDescription("createNotification")

        operation.appName = args.appName || "plasmashell"
        operation.appIcon = args.appIcon || ""
        operation.summary = args.summary || ""
        operation.body = args.body || ""
        if (typeof args.expireTimeout !== "undefined") {
            operation.expireTimeout = args.expireTimeout
        }

        service.startOperationCall(operation)
        if (args.soundFile) {
            sfx.source = args.soundFile
            sfx.play()
        }
    }

    property Audio sfx: Audio {
    }
}
