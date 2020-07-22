import QtQuick 2.0
import QtQuick.Controls 1.0
import QtQuick.Layouts 1.1
import QtQuick.Dialogs 1.0

ColumnLayout {
    id: appearancePage

    property alias cfg_focus_time: focus_time.value
    property alias cfg_short_break_time: short_break_time.value
    property alias cfg_long_break_time: long_break_time.value
    property string cfg_clock_fontfamily: ""
    property alias cfg_timer_start_sfx_enabled: timer_start_sfx_enabled.checked
    property alias cfg_timer_start_sfx_filepath: timer_start_sfx_filepath.text
    property alias cfg_timer_stop_sfx_enabled: timer_stop_sfx_enabled.checked
    property alias cfg_timer_stop_sfx_filepath: timer_stop_sfx_filepath.text
    property alias cfg_timer_auto_next_enabled: timer_auto_next_enabled.checked
    property alias cfg_stop_script_filepath: stop_script_filepath.text
    property alias cfg_stop_script_enabled: stop_script_enabled.checked

    property alias cfg_start_focus_script_filepath: start_focus_script_filepath.text
    property alias cfg_start_focus_script_enabled: start_focus_script_enabled.checked
    property alias cfg_start_break_script_filepath: start_break_script_filepath.text
    property alias cfg_start_break_script_enabled: start_break_script_enabled.checked

    property alias cfg_end_focus_script_filepath: end_focus_script_filepath.text
    property alias cfg_end_focus_script_enabled: end_focus_script_enabled.checked
    property alias cfg_end_break_script_filepath: end_break_script_filepath.text
    property alias cfg_end_break_script_enabled: end_break_script_enabled.checked


    onCfg_clock_fontfamilyChanged: {
        if (cfg_clock_fontfamily) {
            for (var i = 0, j = clock_fontfamilyComboBox.model.length; i < j; ++i) {
                if (clock_fontfamilyComboBox.model[i].value == cfg_clock_fontfamily) {
                    clock_fontfamilyComboBox.currentIndex = i
                    break
                }
            }
        }
    }

    GroupBox {
        Layout.fillWidth: true

        title: i18n("General")

        flat: true
        ColumnLayout {
            RowLayout {
                Label {
                    text: i18n("Timer font:")
                }

                ComboBox {
                    id: clock_fontfamilyComboBox
                    textRole: "text"

                    Component.onCompleted: {
                        var arr = []
                        arr.push({text: i18n("Default"), value: ""})

                        var fonts = Qt.fontFamilies()
                        var foundIndex = 0
                        for (var i = 0, j = fonts.length; i < j; ++i) {
                            arr.push({text: fonts[i], value: fonts[i]})
                        }

                        model = arr
                    }

                    onCurrentIndexChanged: {
                        var current = model[currentIndex]
                        if (current) {
                            cfg_clock_fontfamily = current.value
                        }
                    }
                }
            }
        }
    }

    GroupBox {
        Layout.fillWidth: true

        title: i18n("Time")

        flat: true

        ColumnLayout {
            RowLayout {
                Label {
                    text: i18n("Automatically start next timer: ")
                }

                CheckBox {
                    id: timer_auto_next_enabled
                }
            }

            RowLayout {
                Label {
                    text: i18n("Focus: ")
                }

                SpinBox {
                    id: focus_time
                    suffix: i18ncp("Time in minutes", " min", " min", value)
                }
            }

            RowLayout {
                Label {
                    text: i18n("Short break: ")
                }

                SpinBox {
                    id: short_break_time
                    suffix: i18ncp("Time in minutes", " min", " min", value)
                }
            }

            RowLayout {
                Label {
                    text: i18n("Long break: ")
                }

                SpinBox {
                    id: long_break_time
                    suffix: i18ncp("Time in minutes", " min", " min", value)
                }
            }
        }
    }

    GroupBox {
        Layout.fillWidth: true

        title: i18n("Notification sounds")

        flat: true

        ColumnLayout {
            width: parent.width
            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: timer_start_sfx_enabled
                    text: i18n("Start:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: timer_start_sfx_filepathDialog.visible = true
                    enabled: cfg_timer_start_sfx_enabled
                }
                TextField {
                    id: timer_start_sfx_filepath
                    Layout.fillWidth: true
                    enabled: cfg_timer_start_sfx_enabled
                    placeholderText: "/usr/share/sounds/freedesktop/stereo/dialog-information.oga"
                }
            }

            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: timer_stop_sfx_enabled
                    text: i18n("End:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: timer_stop_sfx_filepathDialog.visible = true
                    enabled: cfg_timer_stop_sfx_enabled
                }
                TextField {
                    id: timer_stop_sfx_filepath
                    Layout.fillWidth: true
                    enabled: cfg_timer_stop_sfx_enabled
                    placeholderText: "/usr/share/sounds/freedesktop/stereo/complete.oga"
                }
            }
        }
    }

    GroupBox {
        Layout.fillWidth: true

        title: i18n("Scripts")

        flat: true

        ColumnLayout {
            width: parent.width
            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: start_focus_script_enabled
                    text: i18n("Start focus:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: start_focus_script_filepathDialog.visible = true
                    enabled: cfg_start_focus_script_enabled
                }
                TextField {
                    id: start_focus_script_filepath
                    Layout.fillWidth: true
                    enabled: cfg_start_focus_script_enabled
                    placeholderText: ""
                }
            }

            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: start_break_script_enabled
                    text: i18n("Start break:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: start_break_script_filepathDialog.visible = true
                    enabled: cfg_start_break_script_enabled
                }
                TextField {
                    id: start_break_script_filepath
                    Layout.fillWidth: true
                    enabled: cfg_start_break_script_enabled
                    placeholderText: ""
                }
            }

            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: end_focus_script_enabled
                    text: i18n("End focus:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: end_focus_script_filepathDialog.visible = true
                    enabled: cfg_end_focus_script_enabled
                }
                TextField {
                    id: end_focus_script_filepath
                    Layout.fillWidth: true
                    enabled: cfg_end_focus_script_enabled
                    placeholderText: ""
                }
            }

            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: end_break_script_enabled
                    text: i18n("End break:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: end_break_script_filepathDialog.visible = true
                    enabled: cfg_end_break_script_enabled
                }
                TextField {
                    id: end_break_script_filepath
                    Layout.fillWidth: true
                    enabled: cfg_end_break_script_enabled
                    placeholderText: ""
                }
            }

            RowLayout {
                Text { width: indentWidth } // indent
                CheckBox {
                    id: stop_script_enabled
                    text: i18n("Stop:")
                }
                Button {
                    text: i18n("Choose")
                    onClicked: stop_script_filepathDialog.visible = true
                    enabled: cfg_stop_script_enabled
                }
                TextField {
                    id: stop_script_filepath
                    Layout.fillWidth: true
                    enabled: cfg_stop_script_enabled
                    placeholderText: ""
                }
            }
        }
    }

    Item {
        // tighten layout
        Layout.fillHeight: true
    }

    FileDialog {
        id: timer_start_sfx_filepathDialog
        title: i18n("Choose a sound effect")
        folder: '/usr/share/sounds'
        nameFilters: [ "Sound files (*.wav *.mp3 *.oga *.ogg)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_timer_start_sfx_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }

    FileDialog {
        id: timer_stop_sfx_filepathDialog
        title: i18n("Choose a sound effect")
        folder: '/usr/share/sounds'
        nameFilters: [ "Sound files (*.wav *.mp3 *.oga *.ogg)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_timer_stop_sfx_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }

    FileDialog {
        id: stop_script_filepathDialog
        title: i18n("Choose stop action script")
        folder: '~/'
        nameFilters: [ "Script file (*.sh)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_stop_script_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }

    FileDialog {
        id: start_focus_script_filepathDialog
        title: i18n("Choose start focus action script")
        folder: '~/'
        nameFilters: [ "Script file (*.sh)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_start_focus_script_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }

    FileDialog {
        id: start_break_script_filepathDialog
        title: i18n("Choose start break action script")
        folder: '~/'
        nameFilters: [ "Script file (*.sh)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_start_break_script_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }

    FileDialog {
        id: end_focus_script_filepathDialog
        title: i18n("Choose end focus action script")
        folder: '~/'
        nameFilters: [ "Script file (*.sh)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_end_focus_script_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }

    FileDialog {
        id: end_break_script_filepathDialog
        title: i18n("Choose end break action script")
        folder: '~/'
        nameFilters: [ "Script file (*.sh)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileUrls)
            cfg_end_break_script_filepath = fileUrl
        }
        onRejected: {
            console.log("Canceled")
        }
    }
}
