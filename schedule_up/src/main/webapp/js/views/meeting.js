var contextMenu;
var formatter = webix.Date.dateToStr("%d-%m-%Y %H:%i");
var meetingView = {

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
            template: "<div id='scheduler_there' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div></div><div class='dhx_cal_header'></div><div id='scheduler_data' class='dhx_cal_data'></div></div>",
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

    selectPanel: function (room) {
        detachAllEvents();
        webix.protoUI({
            name: "activeList"
        }, webix.ui.list, webix.ActiveContent);
        $$("main").removeView(rightPanel);
        meetingView.roomId = room;
        rightPanel = "meetingPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        scheduler.clearAll();
        var event = scheduler.attachEvent("onEmptyClick", function (date, e) {
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

        });
        schedulerEvents.push(event);
        scheduler.config.xml_date = "%d-%m-%Y %H:%i";
        scheduler.config.readonly = true;
        scheduler.config.first_hour = parseInt(companyData.timeFrom.substr(0, 2));

        scheduler.init('scheduler_there', new Date(), "week");
        schedulerEvents.push(scheduler.attachEvent("onEventLoading", function (ev) {
            if (ev.status !== 0)
                ev.color = "#bdd5ff";
            return true;
        }));
        scheduler.load("meeting/getByRoom/" + room.id, "json");

        schedulerEvents.push(scheduler.attachEvent("onContextMenu", function (id, e) {
            if (id != null && scheduler.getEvent(id).status === 0) {
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
                        data: [
                            {
                                id: 1,
                                value: "Izmijenite"
                            },
                            {
                                id: 2,
                                value: "Otkažite"
                            },
                            {
                                id:3,
                                value: "Dodajte izvještaj"
                            }
                        ],
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
                                                        if (result.text()=="Success"){
                                                            var ev=scheduler.getEvent(meetingView.contextMenuEventId);
                                                            ev.status=1;
                                                            ev.color = "#bdd5ff";
                                                            scheduler.updateEvent(ev.id);
                                                            util.messages.showMessage("Sastanak uspješno zatvoren");
                                                        }
                                                }).fail(function (err) {
                                                        util.messages.showErrorMessage("Zatvaranje sastanka nije uspjelo");
                                                })
                                            }
                                        };
                                        webix.confirm(delBox);
                                        break;
                                    case "3":
                                        meetingView.showAddReportDialog(meetingView.contextMenuEventId);
                                        break;
                                }
                            }
                        }
                    });
                    contextMenu.show({
                        x: posx,
                        y: posy
                    });
                } else {
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

    }, updateMeeting: function () {
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

            connection.sendAjax("PUT", "meeting/"+newEventId,
                function (text, data, xhr) {
                    if (data) {
                        util.messages.showMessage("Uspješno izmjenjena  obicna rezervacija.");
                        for(var i=0;i<participants.length;i++){
                            participants[i].meetingId=data.json().id;
                        }
                        connection.sendAjax("POST", "participant/insertAll",
                            function (text, data, xhr) {

                                if (data) {
                                    for(var j=0;j<meetingView.files.length;j++){
                                        var file=meetingView.files[j];
                                        var doc={
                                            name:file['name'],
                                            content:file['content'],
                                            report:file['report'],
                                            meetingId:newEventId
                                        };
                                        documents.push(doc);
                                    }
                                    console.log("prijee dokumenata, poslije ucesnika");
                                    connection.sendAjax("PUT", "document/updateAll/"+newEventId,
                                        function (text, data, xhr) {

                                            if (data) {
                                                console.log("Evo :");
                                                console.log(data.json());
                                            } else
                                                util.messages.showErrorMessage("Neuspješna izmjena dokumenata.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješna izmjena dokumenata.");
                                        }, documents);

                                } else
                                    util.messages.showErrorMessage("Neuspješna izmjena rezervacije.");
                            }, function () {
                                util.messages.showErrorMessage("Neuspješna izmjena rezervacije.");
                            }, participants);


                    } else
                        util.messages.showErrorMessage("Neuspješna izmjena rezervacije.");
                }, function () {
                    util.messages.showErrorMessage("Neuspješna izmjena rezervacije.");
                }, newMeeting);


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
                var pro = webix.ajax().headers({
                    "Content-type": "application/json"
                }).post("meeting", newMeeting).then(function (realData) {
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

                                            } else
                                                util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                                        }, documents);
                                } else {
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
                    template:"#name# <span class='delete-file'><span class='webix fa fa-close'/></span>",
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