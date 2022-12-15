import moment from "moment";


export default class ReportsService {
    static getListReports() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (listReports.success)
                    return resolve(listReports.list)
                else
                    return reject('Error')
            }, 1000)

        })
    }
    static createReport(parametersReport) {
        console.log(parametersReport)
        return new Promise((resolve) => {
            setTimeout(() =>  {
                let sj = JSON.stringify(newRideReport.report)
                if (newRideReport.success)
                    return resolve(JSON.parse(sj))
            }, 3000)

        })
    }
}

const listReports = {
    "list": [
        {
            "created": moment().unix(),
            "title": 'Тестовый отчет',
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
        "title": "New Report",
        "id": Math.random(),
        "sheets": [
            {
                "header": "Employee 1",
                "sections": [
                    {
                        "data": [
                            {
                                "header": "01.11.2021 (Пн)",
                                "rows": [
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "35",
                                        "avg_speed": "66",
                                        "max_speed": "99",
                                        "norm_fuel_consumed": "8",
                                    },
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "777",
                                        "max_speed": "199",
                                        "norm_fuel_consumed": "8",
                                    }
                                ],
                                "total": {
                                    "text": "Итого:",
                                    "time": "120:40",
                                    "length": "78",
                                    "avg_speed": "56",
                                    "max_speed": "77",
                                    "norm_fuel_consumed": "56",
                                }
                            },
                             {
                                "header": "02.11.2021 (Пн)",
                                "rows": [
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "66",
                                        "max_speed": "199",
                                        "norm_fuel_consumed": "8",
                                    },
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "66",
                                        "max_speed": "199",
                                        "norm_fuel_consumed": "8",
                                    }
                                ],
                                "total": {
                                    "text": "Итого:",
                                    "time": "155:40",
                                    "length": "88",
                                    "avg_speed": "56",
                                    "max_speed": "77",
                                    "norm_fuel_consumed": "56",
                                }
                            }
                        ]
                    },
                    {
                        "rows": [
                            {
                                "count":  '5',
                                "length": '45',
                                "time": "4:55",
                                "avg_speed": "45",
                                "max_speed": "55",
                                "norm_fuel_consumed": "6",
                                "odometer": "400563",
                            }
                        ]
                    }
                ]
            },
             {
                "header": "Employee 2",
                "sections": [
                    {
                        "data": [
                            {
                                "header": "01.11.2021 (Пн)",
                                "rows": [
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "66",
                                        "max_speed": "99",
                                        "norm_fuel_consumed": "8",
                                    },
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "66",
                                        "max_speed": "199",
                                        "norm_fuel_consumed": "8",
                                    }
                                ],
                                "total": {
                                    "text": "Итого:",
                                    "time": "120:40",
                                    "length": "78",
                                    "avg_speed": "56",
                                    "max_speed": "77",
                                    "norm_fuel_consumed": "56",
                                }
                            },
                             {
                                "header": "02.11.2021 (Пн)",
                                "rows": [
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "66",
                                        "max_speed": "199",
                                        "norm_fuel_consumed": "8",
                                    },
                                    {
                                        "to": {
                                            "v": "01:00 - Селятино, Наро-Фоминский гор. округ, Московская обл., 108806",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59
                                            }
                                        },
                                        "from": {
                                            "v": "00:00 - Центральная кольцевая автомобильная дорога, гор. округ Солнечногорск, Московская обл.",
                                            "location": {
                                                "lat": 59.30,
                                                "lng": 30.59,
                                            }
                                        },
                                        "time": "22:45",
                                        "length": "45",
                                        "avg_speed": "66",
                                        "max_speed": "199",
                                        "norm_fuel_consumed": "8",
                                    }
                                ],
                                "total": {
                                    "text": "Итого:",
                                    "time": "155:40",
                                    "length": "88",
                                    "avg_speed": "56",
                                    "max_speed": "77",
                                    "norm_fuel_consumed": "56",
                                }
                            }
                        ]
                    },
                    {
                        "rows": [
                            {
                                "count":  '5',
                                "length": '45',
                                "time": "4:55",
                                "avg_speed": "45",
                                "max_speed": "55",
                                "norm_fuel_consumed": "6",
                                "odometer": "400563",
                            }
                        ]
                    }
                ]
            }
        ],
        "from": moment().hours(0).unix(),
        "to": moment().hours(23).unix(),
    },
    "success": true
}
