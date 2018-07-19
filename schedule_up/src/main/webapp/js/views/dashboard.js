var schedulerEvents = [];
var dotDateFormatter = webix.Date.dateToStr("%d.%m.%Y %H:%i");

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
            "&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div><div class=\"dhx_cal_tab\" name=\"day_tab\" style=\"right:204px;\"></div>\n" +
            "        <div class=\"dhx_cal_tab\" name=\"week_tab\" style=\"right:140px;\"></div>\n" +
            "        <div class=\"dhx_cal_tab\" name=\"month_tab\" style=\"right:76px;\"></div></div><div" +
            " class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>",
            },
            {
                view:"accordion",
                collapsed:true,
                multi:true,
                cols:[ //or rows
                    { header:"<span class='fa fa-sticky-note'></span> Oglasi",
                        width:400,
                        body:{
                                view: "list",
                                multiselect: false,
                                id: "noteList",
                                onContext: {},
                                select: "row",
                                navigation: true,
                                editable: false,
                                type: {
                                    height: "auto",
                                    template: function (value) {
                                        var name = value.name;
                                        var date = new Date(value.publishTime);
                                        var hours = date.getHours();
                                        var minutes = date.getMinutes();

                                        minutes = minutes < 10 ? '0' + minutes : minutes;
                                        var strTime = hours + ':' + minutes + "h";
                                        var formattedTime =  date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".  " + strTime;
                                        return "<div class='noteName'>" + name + "</div>" +
                                            "<div class='notePublishTime'>"+ formattedTime + "</div>";
                                    }
                                },
                                url: "note/",
                                on: {
                                    onItemClick: function(id) {
                                        dashboardView.showNotePopup(this.getItem(id));
                                    }
                                }
                            }
                    },
                ]
            },
            ]
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
                        id: "id",
                        name: "id",
                        hidden: true,
                        fillspace: true,

                    }, {
                        view: "text",
                        id: "roomId",
                        name: "roomId",
                        hidden: true,
                        fillspace: true,
                    }, {
                        view: "text",
                        id: "text",
                        name: "text",
                        label: "Naziv:",
                        readonly: true
                    }, {
                        view: "text",
                        id: "start_date",
                        name: "start_date",
                        label: "Početak:",

                        readonly: true
                    },
                        {
                            view: "text",
                            id: "end_date",
                            name: "end_date",
                            label: "Kraj:",
                            readonly: true
                        },
                        {
                            view: "text",
                            id: "roomName",
                            name: "roomName",
                            label: "Sala:",
                            readonly: true
                        },
                        {
                            view: "text",
                            id: "participantNumber",
                            name: "participantNumber",
                            label: "Broj učesnika:",
                            readonly: true
                        },
                        {
                            view: "textarea",
                            id: "description",
                            name: "description",
                            label: "Opis:",
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
                            label: "Autor:"
                        }
                        , {}, {
                            id: "eventDetailsBtn",
                            view: "button",
                            value: "Detaljnije",
                            type: "form",
                            width: 150,
                            on: {
                                'onItemClick': function(id){
                                    dashboardView.showMeetingDialog();
                                }
                            },
                        }]
                }
            ]
        }


    },

    showMeetingDialog: function(){
        if(util.popupIsntAlreadyOpened("meetingDialog")){
            webix.ui(webix.copy(dashboardView.meetingDialog));
            var formRight = $$("rightForm");
            var formBasic = $$("eventDialogForm");
            var format = webix.Date.dateToStr("%d.%m.%Y. %H:%i");

            formRight.elements.text.setValue(formBasic.elements.text.getValue());
            formRight.elements.start_date.setValue(format(formBasic.elements.start_date.getValue()));
            formRight.elements.end_date.setValue(format(formBasic.elements.end_date.getValue()));
            formRight.elements.participantsNumber.setValue(formBasic.elements.participantNumber.getValue().toString());
            formRight.elements.description.setValue(formBasic.elements.description.getValue());
            formRight.elements.roomName.setValue(formBasic.elements.roomName.getValue());
            var autor=$$("creatorNameLbl").data.label.substring("Autor: ".length);
            formRight.elements.creatorName.setValue(autor);

            $$("list").clearAll();
            $$("listDocuments").clearAll();
            var id=formBasic.elements.id.getValue();
            webix.promise.all([webix.ajax("/user/participantsFor/" + id), webix.ajax("document/getAllByMeetingId/" + id)]).then(
                function (results) {
                    $$("list").parse(JSON.parse(results[0].text()));
                    $$("listDocuments").parse(JSON.parse(results[1].text()));
                });

            $$("listParticipants_input").attachEvent("onTimedKeyPress",function(){
                var value = this.getValue().toLowerCase();
                $$("list").filter(function(obj){
                    var firstLastName=obj.firstName+" "+obj.lastName;
                    return firstLastName.toLowerCase().indexOf(value)>-1;
                })
            });

            $$("listDocuments_input").attachEvent("onTimedKeyPress",function(){
                var value = this.getValue().toLowerCase();
                $$("listDocuments").filter(function(obj){
                    return obj.name.toLowerCase().indexOf(value)>-1;
                })
            });

            var formLeft = $$("leftForm");
            /*
            $$("listDocuments").attachEvent("onItemClick", function(id, e, node) {
                //meetingView.showDocumentDetailsDialog(id);
                return false;
            });*/
            $$("meetingDialog").show();
        }
    },

    meetingDialog: {
        view: "popup",
        id: "meetingDialog",
        modal: true,
        position: "center",
        body: {
            id: "meetingDialogInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class=calendar-alt></span> Rezervacija",
                    width: 800
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('meetingDialog');"
                }]
            },
                {

                    cols:[
                        {
                            view: "form",
                            id: "rightForm",
                            width: 400,
                            elementsConfig: {
                                labelWidth: 120,
                                bottomPadding: 8
                            },
                            elements: [{
                                view: "text",
                                id: "text",
                                name: "text",
                                label: "Naziv:",
                                readonly: true
                            },
                                {
                                    view: "text",
                                    id: "creatorName",
                                    name: "creatorName",
                                    label: "Autor:",
                                    readonly: true
                                },
                                {
                                    view: "text",
                                    id: "start_date",
                                    name: "start_date",
                                    label: "Početak:",
                                    readonly: true
                                },
                                {
                                    view: "text",
                                    id: "end_date",
                                    name: "end_date",
                                    label: "Kraj:",
                                    readonly: true
                                },
                                {
                                    view: "text",
                                    id: "roomName",
                                    name: "roomName",
                                    label: "Sala:",
                                    readonly: true
                                },
                                {
                                    view: "text",
                                    id: "participantsNumber",
                                    name: "participantsNumber",
                                    label: "Broj učesnika:",
                                    readonly: true
                                },
                                {
                                    view: "textarea",
                                    id: "description",
                                    name: "description",
                                    label: "Opis:",
                                    readonly: true,
                                    height: 100
                                },
                                {
                                    view:"button",
                                    width:356,
                                    height:46,
                                    value:"Pogledajte lokaciju sale",
                                    id: "location",
                                    name: "location",
                                    click: "dashboardView.showMap",
                                },

                            ]
                        },
                        {
                            view: "form",
                            id: "leftForm",
                            width: 400,
                            elementsConfig: {
                                labelWidth: 120,
                                bottomPadding: 8
                            },
                            elements:[
                                {
                                    id: "listToolbar",
                                    name: "listToolbar",
                                    width:300,
                                    rows:[
                                        {
                                            height: 35,
                                            view:"toolbar",
                                            elements:[
                                                {view:"text", id:"listParticipants_input",label:"Učesnici:", labelWidth:170}
                                            ]
                                        },
                                        {
                                            id:"list",
                                            name: "list",
                                            view:"list",
                                            width:320,
                                            height:200,
                                            float:"left",
                                            margin:"20px",
                                            template:"#firstName# #lastName# <div style='padding-left:18px'> E-mail : #email#</div>",
                                            type:{
                                                height:62
                                            },
                                            select:false,
                                        }
                                    ]
                                },
                                {},
                                {
                                    id: "documentsListToolbar",
                                    name: "documentsListToolbar",
                                    width:300,
                                    rows:[
                                        {
                                            height: 35,
                                            view:"toolbar",
                                            elements:[
                                                {view:"text", id:"listDocuments_input",label:"Dokumenti:", labelWidth:170}
                                            ]
                                        },
                                        {
                                            id:"listDocuments",
                                            name: "listDocuments",
                                            view:"list",
                                            width:320,
                                            height:200,
                                            float:"left",
                                            margin:"20px",
                                            template:"#name# <div style='padding-left:18px'></div>",
                                            type:{
                                                height:32
                                            },
                                            select: true,
                                        }
                                    ]



                                },

                            ]
                        }
                    ]


                },

            ]
        }


    },

    showMap: function(){
        webix.promise.all([webix.ajax("room/getBuildingByRoomId/" + $$("eventDialogForm").elements.roomId.getValue())]).then(
            function (results) {
                var building = JSON.parse(results[0].text());
                roomView.showMapDetailsDialog(building.latitude,building.longitude);
            }
        );

    },

    showEventPopup: function (event) {
        if (util.popupIsntAlreadyOpened("eventDialog")) {
            webix.ui(webix.copy(dashboardView.eventDialog));
            var form = $$("eventDialogForm");
            var format = webix.Date.dateToStr("%d.%m.%Y. %H:%i");

            form.elements.roomId.setValue(event.roomId);
            form.elements.id.setValue(event.id);
            form.elements.text.setValue(event.text);
            form.elements.start_date.setValue(format(event.start_date));
            form.elements.end_date.setValue(format(event.end_date));
            form.elements.participantNumber.setValue(event.participantsNumber);
            form.elements.description.setValue(event.description);
            form.elements.roomName.setValue(event.roomName);
            $$("creatorNameLbl").data.label = "Autor: " + event.creatorUsername;
            $$("eventDialog").show();
        }
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
                            id: "expiredTime",
                            name: "expiredTime",
                            label: "Datum isteka:",
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
        form.elements.name.setValue(note.name);
        form.elements.publishTime.setValue(dotDateFormatter(new Date(note.publishTime)));
        form.elements.expiredTime.setValue(dotDateFormatter(new Date(note.expiredTime)));
        form.elements.username.setValue(note.username);
        form.elements.description.setValue(note.description);
        $$("noteDialog").show();
    }


};

