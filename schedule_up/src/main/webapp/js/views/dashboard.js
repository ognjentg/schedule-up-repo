var dashboardView = {
    panel: {
        id: "dashboardPanel",
        adjust: true,
        rows: [{
            view: "template",
            template: "<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div></div><div class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>",
        }
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "dashboardPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        scheduler.config.xml_date = "%d-%m-%Y %H:%i";
        scheduler.config.readonly = true;
        scheduler.init('scheduler_here', new Date(), "week");
        scheduler.attachEvent("onClick", function (id, e) {
            var event = scheduler.getEvent(id);
            webix.promise.all([webix.ajax("user/" + event.userId), webix.ajax("room/" + event.roomId)]).then(
                function (results) {
                    event.creatorUsername = JSON.parse(results[0].text()).username;
                   event.roomName = JSON.parse(results[1].text()).name;
                    dashboardView.showEventPopup(event);
                }
            );
        });
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