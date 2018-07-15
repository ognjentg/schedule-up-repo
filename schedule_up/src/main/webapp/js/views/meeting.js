var contextMenu;
var holidays;
var formatter = webix.Date.dateToStr("%d-%m-%Y %H:%i");
var parser = webix.Date.strToDate("%d-%m-%Y %H:%i");
var meetingView = {

    room:null,
    roomId:null,
    newEventId:null,
    files:[],
    addMeetingDialog: {
        view: "popup",
        id: "addMeetingDialog",
        modal: true,
        position: "center",
        body: {
            id: "addMeetingInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa fa-calendar_alt'></span> Rezervacija sale",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addMeetingDialog');"
                }]
            }, {
                cols: [
                    {
                        view: "form",
                        id: "addMeetingForm",
                        width: 600,
                        elementsConfig: {
                            labelWidth: 200,
                            bottomPadding: 18
                        },
                        elements: [

                            {
                                view: "text",
                                id: "topic",
                                name: "topic",
                                label: "Tema:",
                                invalidMessage: "Unesite temu!",
                                required: true
                            }, {
                                view: "text",
                                id: "description",
                                name: "description",
                                label: "Opis:",
                                invalidMessage: "Unesite opis!",
                                required: true
                            }, {
                                view: "datepicker",
                                format: "%d-%m-%Y %H:%i",
                                timepicker: true,
                                id: "startTime",
                                name: "startTime",
                                label: "Vrijeme početka:",
                                invalidMessage: "Unesite vrijeme početka!",
                                required: true
                            },
                            {
                                view: "datepicker",
                                format: "%d-%m-%Y %H:%i",
                                timepicker: true,
                                id: "endTime",
                                name: "endTime",
                                label: "Vrijeme završetka:",
                                invalidMessage: "Unesite vrijeme završetka!",
                                required: true
                            }, {
                                cols: [{
                                    view: "text",
                                    id: "email",
                                    name: "email",
                                    label: "E-mail nezaposlenih:",
                                    rules: {
                                        "email": webix.rules.isEmail
                                    }
                                }, {
                                    id: "addEmail",
                                    view: "button",
                                    type: "iconButton",
                                    click: "meetingView.addEmail",
                                    icon: "plus-circle",
                                    width: 35,
                                    height: 0
                                }]
                            },

                            {
                                cols: [{
                                    view: "uploader",
                                    id: "uploader_1",
                                    value: "Dodajte dokument",
                                    on: {
                                        onBeforeFileAdd: function (upload) {
                                            var file = upload.file;
                                            var reader = new FileReader();
                                            reader.onload = function (event) {

                                                var newFileObject = {
                                                    name: file['name'],
                                                    content: event.target.result.split("base64,")[1],
                                                    report: 0,
                                                    meetingId: 1
                                                };
                                                meetingView.files.push(newFileObject);
                                            };
                                            reader.readAsDataURL(file);
                                            return false;
                                        }
                                    }

                                }, {
                                    id: "showFile",
                                    view: "button",
                                    value: "Pregled dokumenata",
                                    type: "form",
                                    click: "meetingView.showFile",
                                }]
                            },
                            {
                                margin: 5,
                                cols: [{}, {
                                    id: "saveMeeting",
                                    view: "button",
                                    value: "Dodajte sastanak",
                                    type: "form",
                                    click: "meetingView.saveMeeting",
                                    hotkey: "enter",
                                    width: 150
                                }]
                            }
                        ]
                    }, {
                        rows: [{
                            view: "label",
                            align: "center",
                            label: "<span class='webix_icon fa fa-user'></span> Učesnici",
                            width: 200

                        }, {
                            view: "list",
                            id: "userList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },
                            template: "#firstName# #lastName#  {common.markCheckbox()}",

                        }]
                    }, {
                        rows: [{
                            view: "label",
                            align: "center",
                            label: "<span class='webix_icon fa fa-users'></span> Korisničke grupe",
                            width: 200

                        }, {
                            view: "list",
                            id: "userGroupList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },

                            template: "#name#  {common.markCheckbox()}"
                        }]
                    }
                    , {
                        rows: [{
                            view: "label",
                            align: "center",
                            label: "<span class='webix_icon fa fa-envelope'></span> E-mail adrese nezaposlenih",
                            width: 200

                        }, {
                            view: "list",
                            id: "userEmailList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },

                            template: "#name#  {common.markCheckbox()}"
                        }]
                    }]
            }]
        }
    },
    editMeetingDialog: {
        view: "popup",
        id: "editMeetingDialog",
        modal: true,
        position: "center",
        body: {
            id: "editMeetingInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa fa-calendar_alt'></span> Izmjena rezervacije",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('editMeetingDialog');"
                }]
            }, {
                cols: [
                    {
                        view: "form",
                        id: "editMeetingForm",
                        width: 600,
                        elementsConfig: {
                            labelWidth: 200,
                            bottomPadding: 18
                        },
                        elements: [

                            {
                                view: "text",
                                id: "topic",
                                name: "topic",
                                label: "Tema:",
                                invalidMessage: "Unesite temu!",
                                required: true
                            }, {
                                view: "text",
                                id: "description",
                                name: "description",
                                label: "Opis:",
                                invalidMessage: "Unesite opis!",
                                required: true
                            }, {
                                view: "datepicker",
                                format: "%d-%m-%Y %H:%i",
                                timepicker: true,
                                id: "startTime",
                                name: "startTime",
                                label: "Vrijeme početka:",
                                invalidMessage: "Unesite vrijeme početka!",
                                required: true
                            },
                            {
                                view: "datepicker",
                                format: "%d-%m-%Y %H:%i",
                                timepicker: true,
                                id: "endTime",
                                name: "endTime",
                                label: "Vrijeme završetka:",
                                invalidMessage: "Unesite vrijeme završetka!",
                                required: true
                            }, {
                                cols: [{
                                    view: "text",
                                    id: "email",
                                    name: "email",
                                    label: "E-mail nezaposlenih:",
                                    rules: {
                                        "email": webix.rules.isEmail
                                    }
                                }, {
                                    id: "addEmail",
                                    view: "button",
                                    type: "iconButton",
                                    click: "meetingView.addEmail",
                                    icon: "plus-circle",
                                    width: 35,
                                    height: 0
                                }]
                            },

                            {
                                cols: [{
                                    view: "uploader",
                                    id: "uploader_1",
                                    value: "Dodajte dokument",
                                    on: {
                                        onBeforeFileAdd: function (upload) {
                                            var file = upload.file;
                                            var reader = new FileReader();
                                            reader.onload = function (event) {

                                                var newFileObject = {
                                                    name: file['name'],
                                                    content: event.target.result.split("base64,")[1],
                                                    report: 0,
                                                    meeting_id: 1
                                                };
                                                meetingView.files.push(newFileObject);
                                            };
                                            reader.readAsDataURL(file);
                                            return false;
                                        }
                                    }

                                }, {
                                    id: "showFile",
                                    view: "button",
                                    value: "Pregled dokumenata",
                                    type: "form",
                                    click: "meetingView.showFile",
                                }]
                            },
                            {
                                margin: 5,
                                cols: [{}, {
                                    id: "saveMeeting",
                                    view: "button",
                                    value: "Izmjenite sastanak",
                                    type: "form",
                                    click: "meetingView.updateMeeting",
                                    hotkey: "enter",
                                }]
                            }
                        ]
                    }, {
                        rows: [{
                            view: "label",
                            align: "center",
                            label: "<span class='webix_icon fa fa-user'></span> Učesnici",
                            width: 200

                        }, {
                            view: "list",
                            id: "userList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },
                            template: "#firstName# #lastName#  {common.markCheckbox()}",

                        }]
                    }, {
                        rows: [{
                            view: "label",
                            align: "center",
                            label: "<span class='webix_icon fa fa-users'></span> Korisničke grupe",
                            width: 200

                        }, {
                            view: "list",
                            id: "userGroupList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },

                            template: "#name#  {common.markCheckbox()}"
                        }]
                    }
                    , {
                        rows: [{
                            view: "label",
                            align: "center",
                            label: "<span class='webix_icon fa fa-envelope'></span> E-mail adrese nezaposlenih",
                            width: 200

                        }, {
                            view: "list",
                            id: "userEmailList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },

                            template: "#name#  {common.markCheckbox()}"
                        }]
                    }]
            }]
        }
    },
    panel: {
        id: "meetingPanel",
        adjust: true,
        rows: [{
            view: "template",
            template: "<div id='scheduler_room_name' class='room-name-scheduler'>ZENA BEZ IMENA malina hahaha </div><div id='scheduler_there' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div><div class=\"dhx_cal_tab\" name=\"day_tab\" style=\"right:204px;\"></div>\n" +
            "        <div class=\"dhx_cal_tab\" name=\"week_tab\" style=\"right:140px;\"></div>\n" +
            "        <div class=\"dhx_cal_tab\" name=\"month_tab\" style=\"right:76px;\"></div></div><div class='dhx_cal_header'></div><div id='scheduler_data' class='dhx_cal_data'></div></div>",
        }
        ]
    },
    addEmail: function () {
        var form = $$("addMeetingForm");
        var userEmail = form.getValues().email;
        if (webix.rules.isEmail(userEmail)) {
            var newObject = {name: userEmail};
            $$("userEmailList").add(newObject);
        }
        else
            util.messages.showErrorMessage("Neispravan format e-mail adrese.");
    }
    ,

    contextMenuEventId: null,

    editMeeting:function(eventId) {
        var form=$$("editMeetingForm")
        if(Date.parse(scheduler.getEvent(eventId).start_date)<Date.now()) {
            util.messages.showErrorMessage("Nije moguće izmijeniti događaj koji je prošao.");
            return;
        }



        newEventId=eventId;
        webix.ui(webix.copy(meetingView.editMeetingDialog)).show();
        var element = scheduler.getEvent(eventId);
        var form = $$("editMeetingForm");
        console.log("eventId:" + eventId);
        console.log(element.text);
        form.elements.topic.setValue(element.text);
        form.elements.startTime.setValue(element.start_date);
        form.elements.endTime.setValue(element.end_date);
        form.elements.description.setValue(element.description);

        //popunjavanje dokumenta
        connection.sendAjax("GET", "document/getAllByMeetingId/" + eventId,
            function (text, data, xhr) {
                if (text) {
                    meetingView.files = data.json();
                    $$("fileList").clearAll();
                    $$("fileList").parse(data.json());

                } else {
                    util.messages.showErrorMessage("Greška pri učitavanju dokumenata.");
                }
            }, function (text, data, xhr) {
                util.messages.showErrorMessage("Greška pri učitavanju dokumenata.");

            }
            , null);
        //popunjavanje korisnika
        connection.sendAjax("GET", "user/nonParticipantsFor/" + eventId,
            function (text, data, xhr) {
                if (text ) {
                    $$("userList").clearAll();
                    $$("userList").parse(data.json());
                } else {
                    util.messages.showErrorMessage("Greška pri učitavanju učesnika.");
                }
            }, function (text, data, xhr) {
                util.messages.showErrorMessage("Greška pri učitavanju učesnika.");

            }
            , null);
        connection.sendAjax("GET", "user-group/nonParticipantsFor/" + eventId,
            function (text, data, xhr) {
                if (text ) {
                    $$("userGroupList").clearAll();
                    $$("userGroupList").parse(data.json());
                } else {
                    util.messages.showErrorMessage("Greška pri učitavanju učesničkih grupa.");
                }
            }, function (text,data,xhr) {
                util.messages.showErrorMessage("Greška pri učitavanju učesničkih grupa.");

            }
            , null);

    },

    selectPanel: function (room,roomName) {
        detachAllEvents();
        webix.protoUI({
            name: "activeList"
        }, webix.ui.list, webix.ActiveContent);
        $$("main").removeView(rightPanel);
        meetingView.room=room;
        meetingView.roomId = room;
        rightPanel = "meetingPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        scheduler.clearAll();
        document.getElementById("scheduler_room_name").innerHTML=roomName;
        var event = scheduler.attachEvent("onEmptyClick", function (date, e) {
            if (date>new Date()&&checkIfNotHoliday(date)) {
                webix.ui(webix.copy(meetingView.addMeetingDialog)).show();
                $$("startTime").setValue(date);
                $$("endTime").setValue(date);
                $$("userList").load("user");
                $$("userGroupList").load("user-group");
                $$("userList").attachEvent("onAfterLoad", function () {
                    $$("userList").filter(function (obj) {
                        return (obj.firstName != null && obj.id != userData.id);
                    });
                });
                $$("userGroupList").attachEvent("onAfterLoad", function () {
                    $$("userGroupList").filter(function (obj) {
                        return obj.name != null;
                    });
                });
            }
        });
        schedulerEvents.push(event);

        var onClick=scheduler.attachEvent("onClick", function (id, e) {
            var event1 = scheduler.getEvent(id);
            event1.roomName = room.name;
            event1.meetingParticipantsExtended = [];
            //alert("Dogadjaj"+" meeting id:"+event1.id);

            webix.promise.all([webix.ajax("user/" + event1.userId), webix.ajax("/user/participantsFor/" + event1.id), webix.ajax("document/getAllByMeetingId/" + event1.id)]).then(
                function (results) {
                    event1.creatorUsername = JSON.parse(results[0].text()).username;
                    //alert(JSON.parse(results[0].text()).username);
                    event1.meetingParticipants = JSON.parse(results[1].text());
                    event1.meetingDocuments = JSON.parse(results[2].text());
                    meetingView.showEventPopup(event1);
                });
        });
        schedulerEvents.push(onClick);

        scheduler.config.xml_date = "%d-%m-%Y %H:%i";
        scheduler.config.readonly = true;
        scheduler.config.first_hour = parseInt(companyData.timeFrom.substr(0, 2));

        schedulerEvents.push(scheduler.attachEvent("onEventLoading", function (ev) {
            if (ev.status !== 0)
                ev.color = "#bdd5ff";
            return true;
        }));
        webix.ajax("holiday").then(function (result) {
            holidays=JSON.parse(result.text());
            for (var i=0;i<holidays.length;i++){
                var holiday=holidays[i];
                scheduler.blockTime(
                    new Date(holiday.date),
                    "fullday"
                );

            }
            scheduler.init('scheduler_there', new Date(), "week");
            scheduler.load("meeting/getByRoom/" + room.id, "json");
        });


        schedulerEvents.push(scheduler.attachEvent("onContextMenu", function (id, e) {
            var activeEventMenu=[
                {
                    id: 1,
                    value: "Izmijenite"
                },
                {
                    id: 2,
                    value: "Zatvorite"
                },
                {
                    id:4,
                    value: "Otkažite"
                }
            ];
            var finishedEventMenu=[
                {
                    id:3,
                    value: "Dodajte izvještaj"
                }
            ];
            if (id != null &&(userData.roleId===2 || scheduler.getEvent(id).userId === userData.id) ) {
                meetingView.contextMenuEventId = id;
                var posx = 0;
                var posy = 0;
                if (e.pageX || e.pageY) {
                    posx = e.pageX;
                    posy = e.pageY;
                } else if (e.clientX || e.clientY) {
                    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                if (contextMenu == null) {

                    contextMenu = webix.ui({
                        view: "contextmenu",
                        on: {
                            onItemClick: function (id) {
                                // Property meetingView.contextMenuEventId je id eventa na koji smo kliknuli.
                                switch (id) {
                                    case "1":
                                        meetingView.editMeeting(meetingView.contextMenuEventId);
                                        break;
                                    case "2":
                                        var delBox = (webix.copy(meetingView.finishMeetingDialog));
                                        delBox.callback = function (result) {
                                            if (result==1){
                                                webix.ajax().put("meeting/finish/"+meetingView.contextMenuEventId).
                                                    then(function(result){
                                                        if (result.text()){
                                                            var ev=scheduler.getEvent(meetingView.contextMenuEventId);
                                                            ev.status=1;
                                                            ev.color = "#bdd5ff";
                                                            scheduler.updateEvent(ev.id);
                                                            util.messages.showMessage("Sastanak uspješno zatvoren");
                                                        }
                                                }).fail(function (err) {
                                                        util.messages.showErrorMessage(err.text());
                                                })
                                            }
                                        };
                                        webix.confirm(delBox);
                                        break;
                                    case "3":
                                        meetingView.showAddReportDialog(meetingView.contextMenuEventId);
                                        break;
                                    case "4":
                                        var delBox = (webix.copy(meetingView.cancelMeetingDialog));
                                        delBox.callback = function (result) {
                                            if (result==1){
                                                webix.ajax().put("meeting/cancel/"+meetingView.contextMenuEventId).
                                                then(function(result){
                                                    if (result.text()){
                                                        scheduler.deleteEvent(meetingView.contextMenuEventId);
                                                        util.messages.showMessage("Sastanak uspješno otkazan");
                                                    }
                                                }).fail(function (err) {
                                                    if (err.responseText) {
                                                        util.messages.showErrorMessage(err.responseText);
                                                    }else{
                                                        util.messages.showErrorMessage("Otkazivanje sastanka nije uspjelo!");
                                                    }
                                                });
                                            }
                                        };
                                        webix.confirm(delBox);
                                        break;
                                }
                            }
                        }
                    });
                    contextMenu.define("data",scheduler.getEvent(id).status===0?activeEventMenu:finishedEventMenu);
                    contextMenu.refresh();
                    contextMenu.show({
                        x: posx,
                        y: posy
                    });
                } else {
                    contextMenu.clearAll();
                    contextMenu.define("data",scheduler.getEvent(id).status===0?activeEventMenu:finishedEventMenu);
                    contextMenu.refresh();
                    contextMenu.show({
                        x: posx,
                        y: posy
                    });
                }

            } else {
                if (contextMenu != null)
                    contextMenu.hide();
            }
            return false;
        }));


    },

    showEventPopup: function (event) {
        //alert("show event popup function"+event.meetingParticipantsExtended[0].name);
        webix.ui(webix.copy(meetingView.eventDialog));
        //
        var formRight = $$("rightForm");
        var format = webix.Date.dateToStr("%d.%m.%Y. %H:%i");

        formRight.elements.text.setValue(event.text);
        formRight.elements.start_date.setValue(format(event.start_date));
        formRight.elements.end_date.setValue(format(event.end_date));
        formRight.elements.participantsNumber.setValue(event.participantsNumber);
        formRight.elements.description.setValue(event.description);
        formRight.elements.roomName.setValue(event.roomName);
        formRight.elements.creatorNameLbl.setValue(event.creatorUsername);

        var formLeft = $$("leftForm");

        $$("list").clearAll();
        //alert("duzina liste ucesnika:"+event.meetingParticipants.length);
        $$("list").parse(event.meetingParticipants);
        $$("listDocuments").clearAll();
        $$("listDocuments").parse(event.meetingDocuments);
        $$("listDocuments").attachEvent("onItemClick", function(id, e, node) {
            //meetingView.showDocumentDetailsDialog(id);
            return false;
            });
        $$("eventDialog").show();
    },

    showDocumentDetailsDialog: function(id){
        webix.ui(webix.copy(meetingView.showDocumentDialog));
        $$("pdf").clear();
        $$("pdf").define('scale', 'page-width');
        var contentEncoded=$$("listDocuments").getItem(id).content;
        var contentDecoded=window.atob(contentEncoded);
        lcFileName = { "data": contentDecoded };

        $$("pdf").load(lcFileName);
        $$("documentLabel").data.label="<span class='webix_icon fa fa-file-pdf '></span> Pregled dokumenta: "+$$("listDocuments").getItem(id).name;
        $$("showDocumentDialog").show();
    },


    showDocumentDialog:{
        view: "popup",
        id: "showDocumentDialog",
        modal: true,
        position: "center",
        body: {
            id: "showDocumentDialogInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    id:"documentLabel",
                    view: "label",
                    label: "<span class='webix_icon fa fa-map-marker '></span> Pregled dokumenta",
                    width: 600,
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('showDocumentDialog');"
                }]
            }, {
                type:"space",
                rows:[
                    { view:"pdfbar",
                        id:"toolbar"
                    },
                    { view:"pdfviewer",
                        id:"pdf",
                        //url:"binary->files/WebixDocs.pdf",
                        toolbar:"toolbar",
                        on:{
                            onDocumentReady:function(){
                                webix.message("Loaded and rendered")
                            }
                        }}
                ]

            },]
        }
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
                    label: "<span class='calendar-alt'></span> Rezervacija",
                    width: 800
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('eventDialog');"
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
                                label: "Naziv",
                                readonly: true
                            },
                                {
                                    view: "text",
                                    id: "creatorNameLbl",
                                    name: "creatorNameLbl",
                                    label: "Autor",
                                    readonly: true
                                },
                                {
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
                                    id: "participantsNumber",
                                    name: "participantsNumber",
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
                                {
                                    view:"button",
                                    width:356,
                                    height:46,
                                    value:"Pogledajte lokaciju sale",
                                    id: "location",
                                    name: "location",
                                    click: "meetingView.showMap",
                                    //click: "roomView.showMapDetailsDialog("+meetingView.room.latitude+","+meetingView.room.longitude+")",
                                    //template: "<span class='fa fa-map-marker info'></span>",

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
                                                {view:"text", id:"listParticipants_input",label:"Učesnici", labelWidth:170}
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
                                                {view:"text", id:"listDocuments_input",label:"Dokumenti", labelWidth:170}
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
                                            /*onClick:{
                                                "downloadDocumentFunction":function(id, e, node){
                                                    console.log("Klik");
                                                    return false;
                                                }
                                            },*/

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
    
     showMap: function () {
         roomView.showMapDetailsDialog(meetingView.room.latitude,meetingView.room.longitude);
     }   


    , updateMeeting: function () {
        var file = meetingView.files[0];
        var participants = [];
        var documents = [];
        var userMails = [];
        var form = $$("editMeetingForm")
        if (Date.parse(form.getValues().startTime) < Date.now()) {
            util.messages.showErrorMessage("Nije moguće odabrati datum koji je prošao.");
            return;
        }
        ;
        $$("userList").data.each(function (obj) {
                if (obj.markCheckbox == 1) {
                    var participant = {
                        userId: obj.id,
                        deleted: 0,
                        companyId: companyData.id,
                        meetingId: 1};

                    participants.push(participant);
                }

            }
        );
        $$("userGroupList").data.each(function (obj) {
                if (obj.markCheckbox == 1) {
                    var group = {
                        userGroupId: obj.id,
                        deleted: 0,
                        companyId: companyData.id,
                        meetingId: 1
                    };
                    participants.push(group);
                }

            }
        );
        $$("userEmailList").data.each(function (obj) {

                var participantOutside = {
                    email: obj.name,
                    deleted: 0,
                    companyId: companyData.id,
                    meetingId: 1
                };
                participants.push(participantOutside);


            }
        );
        var form = $$("editMeetingForm");

        var formatter = webix.Date.dateToStr("%d-%m-%Y %H:%i");
        var today = new Date();

        if (form.validate()) {
            var newMeeting = {
                id:newEventId,
                start_date: formatter(form.getValues().startTime),
                end_date: formatter(form.getValues().endTime),
                description: form.getValues().description,
                text: form.getValues().topic,
                participantsNumber: 0,
                status: 0,
                companyId: companyData.id,
                userId: userData.id,
                roomId: meetingView.roomId.id

            };
            //docukmenti
            if (meetingView.files.length > 0) {
                for (var j = 0; j < meetingView.files.length; j++) {
                    var file = meetingView.files[j];
                    var doc = {
                        name: file['name'],
                        content: file['content'],
                        report: file['report'],
                        meetingId: newEventId
                    };
                    documents.push(doc);
                }}
            for (var i = 0; i < participants.length; i++) {
                participants[i].meetingId = newEventId;
            }
            var pro = webix.ajax().headers({
                "Content-type": "application/json"
            }).put("meeting/"+newEventId, newMeeting).then(function (realData) {
                return webix.ajax().headers({
                    "Content-type": "application/json"
                }).post("participant/insertAll",JSON.stringify(participants));
            }).then(function(realData){
                return webix.ajax().headers({
                    "Content-type": "application/json"
                }).put("document/updateAll/"+newEventId,JSON.stringify(documents));
            }).then(function(realData){
                util.messages.showMessage("Uspješna izmjena rezervacije.")
            });
            pro.fail(function (err) {
                util.messages.showErrorMessage("Neuspješna izmjena rezervacije.");
            });

            util.dismissDialog('editMeetingDialog')

        }
    },
    saveMeeting: function () {
        var file = meetingView.files[0];

        var participants = [];
        var documents = [];
        var userMails = [];
        /*if(Date.parse(form.getValues().startTime)<Date.now()) {
            util.messages.showErrorMessage("Nije moguće odabrati datum koji je prošao.");
            return;
        }*/
        $$("userList").data.each(function (obj) {
                if (obj.markCheckbox == 1) {
                    var participant = {
                        userId: obj.id,
                        deleted: 0,
                        companyId: companyData.id,
                        meetingId: 1
                    };
                    participants.push(participant);
                }

            }
        );
        $$("userGroupList").data.each(function (obj) {
                if (obj.markCheckbox == 1) {
                    var group = {
                        userGroupId: obj.id,
                        deleted: 0,
                        companyId: companyData.id,
                        meetingId: 1
                    };
                    participants.push(group);
                }

            }
        );
        $$("userEmailList").data.each(function (obj) {

                var participantOutside = {
                    email: obj.name,
                    deleted: 0,
                    companyId: companyData.id,
                    meetingId: 1
                };
                participants.push(participantOutside);


            }
        );
        if (participants.length == 0) {
            util.messages.showErrorMessage("Morate odabrati bar jednog učesnika.");

        }
        else {
            var form = $$("addMeetingForm");


            var today = new Date();

            if (form.validate()) {
                var newMeeting = {
                    start_date: formatter(form.getValues().startTime),
                    end_date: formatter(form.getValues().endTime),
                    description: form.getValues().description,
                    text: form.getValues().topic,
                    participantsNumber: 0,
                    status: 0,
                    companyId: companyData.id,
                    userId: userData.id,
                    roomId: meetingView.roomId.id

                };
                var insertedMeeting;
                var pro = webix.ajax().headers({
                    "Content-type": "application/json"
                }).post("meeting", newMeeting).then(function (realData) {
                    insertedMeeting=realData.json();
                    for (var i = 0; i < participants.length; i++) {
                        participants[i].meetingId = realData.json().id;

                    }

                    connection.sendAjax("POST", "participant/insertAll",
                        function (text, data, xhr) {

                            if (data) {
                                if (meetingView.files.length > 0) {
                                    for (var j = 0; j < meetingView.files.length; j++) {
                                        var file = meetingView.files[j];
                                        var doc = {
                                            name: file['name'],
                                            content: file['content'],
                                            report: file['report'],
                                            meetingId: realData.json().id
                                        };
                                        documents.push(doc);
                                    }
                                    connection.sendAjax("POST", "document/list/",
                                        function (text, data, xhr) {

                                            if (data) {
                                                meetingView.files = [];
                                                $$("fileList").clearAll();
                                                util.messages.showMessage("Uspješno kreirana rezervacija.");
                                                scheduler.addEvent(insertedMeeting);

                                            } else
                                                util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                                        }, documents);
                                } else {
                                    scheduler.addEvent(insertedMeeting);
                                    util.messages.showMessage("Uspješno kreirana rezervacija.");
                                }
                            } else
                                util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                        }, function () {
                            util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                        }, participants);

                });
                pro.fail(function (err) {
                    util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                });
                util.dismissDialog('addMeetingDialog')
            }
        }
    }, hide: function () {
        $$("tmpFile").hide();
    },
    showFile: function () {
        var help = meetingView.files[0];
        $$("tmpFile").show();
        $$("fileList").parse(meetingView.files);

    },

    finishMeetingDialog:{
        title: "Zatvaranje sastanka",
        ok: "Da",
        cancel: "Ne",
        width: 500,
        text: "Da li ste sigurni da želite da zatvorite sastanak?"
    },
    cancelMeetingDialog:{
        title: "Otkazivanje sastanka",
        ok: "Da",
        cancel: "Ne",
        width: 500,
        text: "Da li ste sigurni da želite da otkažete sastanak?"
    },
    addReportDialog:{
        view:"popup",
        id: "addReportDialog",
        modal: true,
        position: "center",
        meetingId:null,
        body:{
            rows:[
                {
                    view:"toolbar",
                    cols:[
                        {
                            view:"label",
                            width:200,
                            label:"<span class='webix icon_delete fa fa-file'/> Dodavanje izvještaja"
                        },
                        {},
                        {
                            view:"icon",
                            icon:"close",
                            align:"right",
                            click:"util.dismissDialog('addReportDialog');"
                        }
                    ]
                },
                {
                    cols:[
                        {
                            view:"label",
                            width:150,
                            label:"Dodajte dokumente"
                        },
                        {},
                        {
                            view:"uploader",
                            id:"reportUploader",
                            width:32,
                            height:32,
                            css:"upload",
                            template:"<span class='webix fa fa-upload' /></span>",
                            on: {
                                onBeforeFileAdd: function (upload) {
                                    var file = upload.file;
                                    var reader = new FileReader();
                                    reader.onload = function (event) {

                                        var newDocument = {
                                            name: file['name'],
                                            content: event.target.result.split("base64,")[1],
                                            report: 1,
                                            meetingId: meetingView.addReportDialog.meetingId
                                        };
                                        $$("reportList").add(newDocument);
                                    };
                                    reader.readAsDataURL(file);
                                    return false;
                                }
                            }
                        }
                    ]
                },
                {
                    view:"list",
                    id:"reportList",
                    autowidth:true,
                    height:200,
                    css:"relative",
                    template:"<div class='list-name'>#name#</div> <span class='delete-file'><span class='webix fa fa-close'/></span>",
                    onClick:{
                        'delete-file':function (e,id) {
                            this.remove(id);
                            return false;
                        }
                    }
                },
                {
                    view:"button",
                    width:140,
                    value:"Dodajte izvještaj",
                    click:function () {
                        var list=$$("reportList");
                        if (list.count()===0){
                            util.messages.showErrorMessage("Nije odabran nijedan dokument!");
                            return;
                        }
                        var reports=[];
                        list.data.each(function (report) {
                            report.id=null;
                            reports.push(report);
                        });

                        webix.ajax().headers({
                            "Content-type": "application/json"
                        }).post("document/list/",JSON.stringify(reports)).then(function (result) {
                            util.messages.showMessage("Izvještaj je uspješno dodat.");
                            util.dismissDialog("addReportDialog");
                        }).fail(function (err) {
                            util.messages.showErrorMessage("Dodavanje izvještaja nije uspjelo!");
                            util.dismissDialog("addReportDialog");
                        });
                    }
                }
            ]
        }
    },
    showAddReportDialog: function (meetingId) {
        var dialog=webix.ui(webix.copy(meetingView.addReportDialog));
        meetingView.addReportDialog.meetingId=meetingId;
        dialog.show();
    }



};

var checkIfNotHoliday=function(date){

    var probe = {
        start_date: new Date(date),
        end_date: scheduler.date.add(date, scheduler.config.time_step, "minute")
    };
    return scheduler.checkLimitViolation(probe);
};
webix.ui({
    view: "popup",
    id: "tmpFile",
    position: "center",
    close: true,
    body: {
        rows: [{
            view: "toolbar",
            cols: [{
                view: "label",
                label: "<span class='webix_icon fa fa-file'></span> Dodani dokumenti",
                width: 400
            }, {}, {
                hotkey: 'esc',
                view: "icon",
                icon: "close",
                align: "right",
                click: "meetingView.hide",
            }]
        }, {
            view: "list",
            id: "fileList",
            width: 300,
            height: 300,
            margin: 20,
            template: "#!name#  {common.markX()}",
            data: meetingView.files,

            type: {
                markX: function (obj) {
                    return "   <span class='check webix_icon fa fa-window-close'></span>";
                }
            },
            onClick: {
                "check": function (e, id) {
                    var item = this.getItem(id);
                    meetingView.files.pop(item);
                    $$("fileList").remove(item.id);


                }

            }
        }]
    }
})