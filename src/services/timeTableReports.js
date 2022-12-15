import moment from "moment";


export default class ReportsService {
    static getListReports() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (listReports.success)
                    return resolve(listReports.list)
                else
                    return reject('Error')
            }, 3000)

        })
    }
    static createReport(parametersReport) {
        console.log(parametersReport)
        return new Promise((resolve) => {
            setTimeout(() =>  {
                if (newRideReport.success)
                    return resolve(newRideReport.report)
            }, 10000)

        })
    }
}

const listReports = {
    "list": [
        {
            "created": moment().unix(),
            "title": 'Отчет по по поездкам',
            "periodicity": "Каждый вторник",
            "time_filter": {
                "from": moment().hours(0).unix(),
                "to": moment().hours(23).unix(),
                "weekdays": [0,1,2.,3,4,5,6],
            },
            "id": 1,
            "parameters": {
                "trackers": [205,204],
                "plugins": [
                    {
                        "filter": true,
                        "hide_empty_tabs": false,
                        "show_coordinates": true,
                        "split": false,
                        "include_summary_sheet_only": false,
                        "show_seconds": false,
                        "group_by_driver": true,
                        "report_sub_type": "text - тип отчета, например, 'track_trace' (это запрос на получение отчета по поездкам)",
                        "show_idle_duration": true,
                    }
                ]
            },
            "type": "text - тип пользователя (пока что просто user, другие типы и нюансы, связанные с генерацией отчетов разными типами пользователей пока не рассматриваем)",
            "from": moment().hours(0).unix(),
            "to": moment().hours(23).unix(),
        },
    ],
    'success': true
}

// этот отчет получается, если зачекать 'разделять стоянками' на вкладке "дополнительно", нужен он, т.к. галочка разедять стоянками по умолчанию включена, альтернативные версии отображения я сделаю потом по аналогии с твоим отчетом
const newRideReport = {
    "report": {
        "created": moment().unix(),
        "time_filter": {
                "from": moment().hours(2).unix(),
                "to": moment().hours(22).unix(),
                "weekdays": [0,1,2.,3,4,5,6],
            },
        "title": "New Fucking Report",
        "id": Math.random(),
        "sheets": [],
        "from": moment().hours(0).unix(),
        "to": moment().hours(23).unix(),
    },
    "success": true
}