var schedulerEvents = [];

var detachAllEvents = function () {
    for(var i=0;i<schedulerEvents.length;i++){
        scheduler.detachEvent(schedulerEvents[i]);
    }
    schedulerEvents = [];
}
var dashboardView = {

    panel: {
        id: "dashboardPanel",
        adjust: true,
        cols: [{
            view: "template",
            template: "<div id='scheduler_here' class='dhx_cal_container' " +
            "style='width:100%; height:100%;'><div class='dhx_cal_navline'>" +
            "<div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>" +
            "&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div></div><div" +
            " class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>",
            gravity: 1.3
            }, {
            gravity: 0.1
            },
            {
            rows: [{
                view: "toolbar",
                padding: 8,
                css: "panelToolbar",
                cols: [{
                    view: "label",
                    width: 400,
                    template: "<span class='fa fa-sticky-note'></span> Oglasi"
                }]
            }, {
                view: "datatable",
                css: "webixDatatable",
                multiselect: false,
                id: "notesDT",
                resizeColumn: true,
                resizeRow: true,
                onContext: {},
                columns: [{
                    id: "id",
                    hidden: true,
                    fillspace: true
                }, {
                    id: "publishTime",
                    editable: false,
                    fillspace: false,
                    width: 150,
                    editor: "date",
                    header: ["Datum objave", {
                        content: "textFilter"
                    }],
                    format: function (value) {
                        date = new Date(value);
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        var strTime = hours + ':' + minutes + "h";
                        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".  " + strTime;
                    }
                }, {
                    id: "name",
                    editable: false,
                    fillspace: false, width: 400,
                    editor: "text",
                    header: ["Naziv", {
                        content: "textFilter"
                    }]
                }] ,
                select: "row",
                navigation: true,
                editable: false,
                url: "note/",
                on: {
                    onAfterContextMenu: function (item) {
                        this.select(item.row);
                    }
                }
            }

            ]
        }]
    },

    selectPanel: function () {
        detachAllEvents();
        $$("main").removeView(rightPanel);
        rightPanel = "dashboardPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));

        scheduler.config.xml_date="%d-%m-%Y %H:%i";
        scheduler.config.readonly=true;
        scheduler.config.first_hour=parseInt(companyData.timeFrom.substr(0,2));
        scheduler.init("scheduler_here",new Date(),"week");
        scheduler.clearAll();

       var onClick=scheduler.attachEvent("onClick", function (id, e) {
            var event = scheduler.getEvent(id);
            webix.promise.all([webix.ajax("user/" + event.userId), webix.ajax("room/" + event.roomId)]).then(
                function (results) {
                    event.creatorUsername = JSON.parse(results[0].text()).username;
                   event.roomName = JSON.parse(results[1].text()).name;
                    dashboardView.showEventPopup(event);
                }
            );
        });
        schedulerEvents.push(onClick);
        schedulerEvents.push(scheduler.attachEvent("onEventLoading", function(ev){
            if (ev.status!==0)
                ev.color="#bdd5ff";
            return true;
        }));
        scheduler.load("meeting/", "json");


    },
    eventDialog: {
        view: "popup",
        id: "eventDialog",
        modal: true,
        position: "center",
        body: {
            id: "eventInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-bookmark'></span> Rezervacija",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('eventDialog');"
                }]
            },
                {
                    view: "form",
                    id: "eventDialogForm",
                    width: 250,
                    elementsConfig: {
                        labelWidth: 120,
                        bottomPadding: 8
                    },
                    elements: [{
                        view: "text",
                        id: "text",
                        name: "text",
                        label: "Naziv",
                        readonly: true
                    }, {
                        view: "text",
                        id: "start_date",
                        name: "start_date",
                        label: "Početak",

                        readonly: true
                    },
                        {
                            view: "text",
                            id: "end_date",
                            name: "end_date",
                            label: "Kraj",
                            readonly: true
                        },
                        {
                            view: "text",
                            id: "roomName",
                            name: "roomName",
                            label: "Sala",
                            readonly: true
                        },
                        {
                            view: "text",
                            id: "participantNumber",
                            name: "participantNumber",
                            label: "Broj učesnika",
                            readonly: true
                        },
                        {
                            view: "textarea",
                            id: "description",
                            name: "description",
                            label: "Opis",
                            readonly: true,
                            height: 100
                        },

                    ]

                },
                {
                    view: "toolbar",
                    cols: [
                        {
                            id: "creatorNameLbl",
                            view: "label",
                            label: "Autor"
                        }
                        , {}, {
                            id: "eventDetailsBtn",
                            view: "button",
                            value: "Detaljnije",
                            type: "form",
                            width: 150
                        }]
                }
            ]
        }


    },


    showEventPopup: function (event) {
        webix.ui(webix.copy(dashboardView.eventDialog));
        var form = $$("eventDialogForm");
        var format = webix.Date.dateToStr("%d.%m.%Y. %H:%i");

        form.elements.text.setValue(event.text);
        form.elements.start_date.setValue(format(event.start_date));
        form.elements.end_date.setValue(format(event.end_date));
        form.elements.participantNumber.setValue(event.participantsNumber);
        form.elements.description.setValue(event.description);
        form.elements.roomName.setValue(event.roomName);
        $$("creatorNameLbl").data.label = "Autor: " + event.creatorUsername;
        $$("eventDialog").show();
    },

    noteDialog: {
        view: "popup",
        id: "noteDialog",
        modal: true,
        position: "center",
        body: {
            id: "noteInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-sticky-note'></span> Oglas",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('noteDialog');"
                }]
            },
                {
                    view: "form",
                    id: "noteDialogForm",
                    width: 250,
                    elementsConfig: {
                        labelWidth: 120,
                        bottomPadding: 8
                    },
                    elements: [{
                        view: "text",
                        id: "name",
                        name: "name",
                        label: "Naslov",
                        readonly: true
                    }, {
                        view: "text",
                        id: "publishTime",
                        name: "publishTime",
                        label: "Datum objave",
                        readonly: true
                    },
                        {
                            view: "text",
                            id: "username",
                            name: "username",
                            label: "Korisnik",
                            readonly: true
                        },
                        {
                            view: "textarea",
                            id: "description",
                            name: "description",
                            label: "Opis",
                            readonly: true,
                            height: 100
                        }
                    ]
                }
            ]
        }
    },

    showNotePopup: function (note) {
        webix.ui(webix.copy(dashboardView.noteDialog));
        var form = $$("noteDialogForm");

        //formatiranje
        var date = new Date(note.publishTime);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        var formattedTime =  date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ". " + strTime;

        form.elements.name.setValue(note.name);
        form.elements.publishTime.setValue(formattedTime);
        form.elements.username.setValue(note.username);
        form.elements.description.setValue(note.description);

        $$("noteDialog").show();
    }


};