var meetingDetailsView = {

    addEditMeetingDialog: {
        view: "popup",
        id: "addEditMeetingDialog",
        modal: true,
        position: "center",
        body: {
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa fa-calendar'></span> Rezervacija sale",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addEditMeetingDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            //basic info
                            rows: [
                                {
                                    view: "form",
                                    id: "addEditMeetingForm",
                                    width: 500,
                                    elementsConfig: {
                                        labelWidth: 150,
                                        bottomPadding: 18
                                    },
                                    elements: [
                                        {
                                            view: "text",
                                            id: "id",
                                            name: "id",
                                            hidden: true,

                                        },
                                        {
                                            view: "text",
                                            id: "userId",
                                            name: "userId",
                                            hidden: true,

                                        },
                                        {
                                            view: "text",
                                            id: "topic",
                                            name: "topic",
                                            label: "Tema:",


                                            invalidMessage: "Unesite temu!",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            id: "description",
                                            name: "description",
                                            label: "Opis:",
                                            invalidMessage: "Unesite opis!",
                                            required: true
                                        },
                                        {
                                            view: "datepicker",
                                            editable:true,
                                            format: "%d.%m.%Y. %H:%i",
                                            timepicker: true,
                                            id: "startTime",
                                            name: "startTime",
                                            label: "Vrijeme početka:",
                                            invalidMessage: "Unesite vrijeme početka!",
                                            required: true
                                        },
                                        {
                                            view: "datepicker",
                                            editable:true,
                                            format: "%d.%m.%Y. %H:%i",
                                            timepicker: true,
                                            id: "endTime",
                                            name: "endTime",
                                            label: "Vrijeme završetka:",
                                            invalidMessage: "Unesite vrijeme završetka!",
                                            required: true
                                        }
                                    ],
                                    rules: {
                                        "startTime": function (value) {
                                            if (!value) {
                                                $$('addEditMeetingForm').elements.startTime.config.invalidMessage = 'Unesite vrijeme početka!';
                                                return false;
                                            }
                                            if (value < new Date()) {
                                                $$('addEditMeetingForm').elements.startTime.config.invalidMessage = 'Vrijeme početka ne smije biti u prošlosti!';
                                                return false;
                                            }
                                            return true;
                                        },
                                        "endTime": function (value) {
                                            if (!value) {
                                                $$('addEditMeetingForm').elements.endTime.config.invalidMessage = 'Unesite vrijeme završetka!';
                                                return false;
                                            }
                                            if (value < $$("startTime").getValue()) {
                                                $$('addEditMeetingForm').elements.endTime.config.invalidMessage = 'Vrijeme završetka ne smije biti prije vremena početka!';
                                                return false;
                                            }
                                            return true;
                                        }
                                    }
                                },
                                {
                                    view: "toolbar",
                                    cols: [
                                        {
                                            view: "label",
                                            label: "<span class='webix_icon fa fa-file'></span> Dokumenti",
                                            width: 200
                                        },
                                        {},
                                        {
                                            view: "uploader",
                                            id: "documentUploader",
                                            label: "Dodajte",
                                            on: {
                                                onBeforeFileAdd: function (upload) {
                                                    var file = upload.file;
                                                    var reader = new FileReader();
                                                    reader.onload = function (event) {

                                                        var newDocument = {
                                                            name: file['name'],
                                                            content: event.target.result.split("base64,")[1],
                                                            report: 0,
                                                            newEntry: true
                                                        };
                                                        $$("documentList").add(newDocument);
                                                    };
                                                    reader.readAsDataURL(file);
                                                    return false;
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    view: "list",
                                    id: "documentList",
                                    width: 500,
                                    height: 150,
                                    css: "relative",
                                    template: "<div class='list-name'>#name#</div> <span class='delete-file'><span class='webix fa fa-close'/></span>",
                                    onClick: {
                                        'delete-file': function (e, id) {
                                            this.remove(id);
                                            return false;
                                        },
                                        'list-name': function (e, id) {
                                            var item = $$("documentList").getItem(id);
                                            var blob = util.b64toBlob(item.content);
                                            saveFileAs(blob, item.name);
                                            return false;
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            //participants
                            view: "tabview",
                            width: 350,
                            cells: [
                                {
                                    header: "<span class='webix_icon fa fa-user'/> Učesnici",
                                    rows: [
                                        {
                                            view: "toolbar",
                                            id: "participantToolbar",
                                            cols: [
                                                {
                                                    view: "combo",
                                                    id: "participantSearchInput"
                                                },
                                                {
                                                    id: "addParticipantBtn",
                                                    view: "button",
                                                    type: "iconButton",
                                                    hotkey: "enter",
                                                    icon: "plus-circle",
                                                    click: "meetingDetailsView.addParticipant();",

                                                    width: 36
                                                }
                                            ]
                                        },
                                        {
                                            id: "participantList",
                                            view: "list",
                                            css: "relative",
                                            template: function (obj) {
                                                if (obj.newEntry)
                                                    return obj.value + "<span class='delete-file'><span class='webix fa fa-close'/></span>";
                                                else return obj.value;
                                            },
                                            onClick: {
                                                'delete-file': function (e, id) {
                                                    meetingDetailsView.nonParticipantsUser.push($$("participantList").getItem(id));
                                                    this.remove(id);
                                                    $$("participantSearchInput").define("options", meetingDetailsView.nonParticipantsUser);
                                                    $$("participantSearchInput").refresh();
                                                    return false;
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    header: "<span class='webix_icon fa fa-users'/> Grupe",
                                    rows: [
                                        {
                                            view: "toolbar",
                                            id: "groupToolbar",
                                            cols: [
                                                {
                                                    view: "combo",
                                                    id: "groupSearchInput"
                                                },
                                                {
                                                    id: "addGroupBtn",
                                                    view: "button",
                                                    hotkey: "enter",
                                                    type: "iconButton",
                                                    click: "meetingDetailsView.addGroup();",
                                                    icon: "plus-circle",
                                                    width: 36
                                                }
                                            ]
                                        },
                                        {
                                            id: "groupList",
                                            view: "list",
                                            css: "relative",
                                            template: function (obj) {
                                                if (obj.newEntry)
                                                    return obj.value + "<span class='delete-file'><span class='webix fa fa-close'/></span>";
                                                else return obj.value;
                                            },
                                            onClick: {
                                                'delete-file': function (e, id) {
                                                    meetingDetailsView.nonParticipantsGroup.push($$("groupList").getItem(id));
                                                    this.remove(id);
                                                    $$("groupSearchInput").define("options", meetingDetailsView.nonParticipantsGroup);
                                                    $$("groupSearchInput").refresh();
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    header: "<span class='webix_icon fa fa-envelope'/> Ostali",
                                    rows: [
                                        {
                                            view: "toolbar",
                                            id: "otherToolbar",
                                            cols: [
                                                {
                                                    view: "text",
                                                    id: "otherSearchInput"
                                                },
                                                {
                                                    id: "addOtherBtn",
                                                    view: "button",
                                                    hotkey: "enter",
                                                    type: "iconButton",
                                                    icon: "plus-circle",
                                                    width: 36,
                                                    click: "meetingDetailsView.addOther();"
                                                }
                                            ]
                                        },
                                        {
                                            id: "otherList",
                                            view: "list",
                                            css: "relative",
                                            template: function (obj) {
                                                if (obj.newEntry)
                                                    return obj.value + "<span class='delete-file'><span class='webix fa fa-close'/></span>";
                                                else return obj.value;
                                            },
                                            onClick: {
                                                'delete-file': function (e, id) {
                                                    this.remove(id);
                                                    return false;
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {

                    cols: [
                        {
                            view: "label",
                            id: "authorNameLbl",
                            label: "Autor:",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'enter',
                            id: "addMeetingBtn",
                            view: "button",
                            type: "iconButton",
                            label: "Dodajte sastanak",
                            icon: "plus-circle",
                            click: "meetingDetailsView.addMeeting();",
                            autowidth: true
                        },
                        {
                            hotkey: 'enter',
                            id: "editMeetingBtn",
                            view: "button",
                            label: "Sačuvajte",
                            click: "meetingDetailsView.saveEditedMeeting();",
                            autowidth: true
                        }
                    ]
                }
            ]
        }
    },


    showAddDialog: function (date) {
        var dialog = webix.copy(meetingDetailsView.addEditMeetingDialog);

        webix.ui(dialog).show();
        meetingDetailsView.nonParticipantsUser = [];
        meetingDetailsView.nonParticipantsGroup = [];
        $$("editMeetingBtn").hide();
        $$("authorNameLbl").setValue("Autor: " + userData.firstName + " " + userData.lastName);
        $$("startTime").setValue(date);
        $$("endTime").setValue(new Date(date.getTime() + 60000));
        webix.ajax().get("user").then(function (result) {
            var userArray = JSON.parse(result.text());
            for (var i = 0; i < userArray.length; i++) {
                var user = userArray[i];
                if (user.id != userData.id)
                    meetingDetailsView.nonParticipantsUser.push({
                        id: user.id,
                        value: user.firstName + ' ' + user.lastName
                    });
            }
            $$("participantSearchInput").define("options", meetingDetailsView.nonParticipantsUser);
            $$("participantSearchInput").refresh();
        });
        webix.ajax().get("user-group").then(function (result) {
            var groupArray = JSON.parse(result.text());
            for (var i = 0; i < groupArray.length; i++) {
                var group = groupArray[i];
                meetingDetailsView.nonParticipantsGroup.push({
                    id: group.id,
                    value: group.name
                });
            }
            $$("groupSearchInput").define("options", meetingDetailsView.nonParticipantsGroup);
            $$("groupSearchInput").refresh();
        });

    },

    showEditDialog: function (eventId) {
        if (Date.parse(scheduler.getEvent(eventId).end_date) < Date.now()) {
            util.messages.showErrorMessage("Nije moguće izmijeniti događaj koji je prošao.");
            return;
        }
        meetingDetailsView.nonParticipantsUser = [];
        meetingDetailsView.nonParticipantsGroup = [];
        webix.ui(webix.copy(meetingDetailsView.addEditMeetingDialog)).show();
        $$("addMeetingBtn").hide();
        var meeting = scheduler.getEvent(eventId);
        var form = $$("addEditMeetingForm");
        form.elements.id.setValue(meeting.id);
        form.elements.userId.setValue(meeting.userId);
        form.elements.topic.setValue(meeting.text);
        form.elements.startTime.setValue(meeting.start_date);
        form.elements.endTime.setValue(meeting.end_date);
        form.elements.description.setValue(meeting.description);
        webix.ajax().get("meeting/full/" + eventId).then(function (result) {
            var text = result.text();
            if (text) {
                var meetingObject = JSON.parse(text);
                $$("authorNameLbl").setValue("Autor: " + meetingObject['author'].firstName + " " + meetingObject['author'].lastName);
                meetingObject['documents'].forEach(function (obj) {
                    $$("documentList").add(obj);
                });
                meetingObject['participantsUser'].forEach(function (obj) {
                    $$("participantList").add({value: obj.firstName + " " + obj.lastName});
                });
                meetingObject['participantsGroup'].forEach(function (obj) {
                    $$("groupList").add({value: obj.name});
                });
                meetingObject['participantsOther'].forEach(function (obj) {
                    $$("otherList").add({value: obj});
                });

            }
        }).fail(function (err) {
            util.messages.showErrorMessage(err.responseText);
        });
        webix.ajax().get("user/nonParticipantsFor/" + eventId).then(function (result) {
            if (result.text()) {
                var nonParticipants = JSON.parse(result.text());
                nonParticipants.forEach(function (user) {
                    meetingDetailsView.nonParticipantsUser.push({
                        id: user.id,
                        value: user.firstName + ' ' + user.lastName
                    });
                });
                $$("participantSearchInput").define("options", meetingDetailsView.nonParticipantsUser);
                $$("participantSearchInput").refresh();
            }
        });
        webix.ajax().get("user-group/nonParticipantsFor/" + eventId).then(function (result) {
            var groupArray = JSON.parse(result.text());
            for (var i = 0; i < groupArray.length; i++) {
                var group = groupArray[i];
                meetingDetailsView.nonParticipantsGroup.push({
                    id: group.id,
                    value: group.name
                });
            }
            $$("groupSearchInput").define("options", meetingDetailsView.nonParticipantsGroup);
            $$("groupSearchInput").refresh();
        });

    },

    showEventInfo: function (eventId) {
        webix.ui(webix.copy(meetingDetailsView.addEditMeetingDialog)).show();
        $$("addMeetingBtn").hide();
        $$("editMeetingBtn").hide();
        $$("documentUploader").hide();
        $$("participantToolbar").hide();
        $$("groupToolbar").hide();
        $$("otherToolbar").hide();
        $$("documentList").define("template", "<div class='list-name'>#name#</div>");
        $$("documentList").refresh();

        var meeting = scheduler.getEvent(eventId);
        var form = $$("addEditMeetingForm");
        var $object = form.elements;
        for (var key in $object) {
            var $el = $object[key];
            $el.define("readonly", "true")
            $el.define("required", false);
            $el.refresh()
            //el  - webix view
        }

        form.elements.id.setValue(meeting.id);
        form.elements.userId.setValue(meeting.userId);
        form.elements.topic.setValue(meeting.text);
        form.elements.startTime.setValue(meeting.start_date);
        form.elements.endTime.setValue(meeting.end_date);
        form.elements.description.setValue(meeting.description);
        webix.ajax().get("meeting/full/" + eventId).then(function (result) {
            var text = result.text();
            if (text) {
                var meetingObject = JSON.parse(text);
                $$("authorNameLbl").setValue("Autor: " + meetingObject['author'].firstName + " " + meetingObject['author'].lastName);
                meetingObject['documents'].forEach(function (obj) {
                    $$("documentList").add(obj);
                });
                meetingObject['participantsUser'].forEach(function (obj) {
                    $$("participantList").add({value: obj.firstName + " " + obj.lastName});
                });
                meetingObject['participantsGroup'].forEach(function (obj) {
                    $$("groupList").add({value: obj.name});
                });
                meetingObject['participantsOther'].forEach(function (obj) {
                    $$("otherList").add({value: obj});
                });

            }
        }).fail(function (err) {
            util.messages.showErrorMessage(err.responseText);
        });

    },
    addOther: function () {
        var newEmail = $$("otherSearchInput").getValue();
        if (newEmail) {
            if (webix.rules.isEmail(newEmail)) {
                var newObject = {
                    value: newEmail,
                    newEntry: true
                };
                var uniqueEmail = true;
                $$("otherList").data.each(function (obj) {
                    if (obj.value == newEmail) {
                        util.messages.showErrorMessage("E-mail već postoji!");
                        uniqueEmail = false;
                        return;
                    }
                });
                if (uniqueEmail) {
                    $$("otherList").add(newObject);
                    $$("otherSearchInput").setValue("");
                }
                return;
            } else {
                util.messages.showErrorMessage("E-mail nije validan!");
                return;
            }
        }
    },

    addParticipant: function () {
        var input = $$("participantSearchInput").getInputNode().value;
        if (input && checkIfValueIsInArray(meetingDetailsView.nonParticipantsUser, input)) {
            var index = getIndexByValue(meetingDetailsView.nonParticipantsUser, input);
            var objectToAdd = meetingDetailsView.nonParticipantsUser.splice(index, 1)[0];
            $$("participantSearchInput").define("options", meetingDetailsView.nonParticipantsUser);
            $$("participantSearchInput").refresh();
            objectToAdd.newEntry = true;
            $$("participantList").add(objectToAdd);

        }

    },
    addGroup: function () {
        var input = $$("groupSearchInput").getInputNode().value;
        if (input && checkIfValueIsInArray(meetingDetailsView.nonParticipantsGroup, input)) {
            var index = getIndexByValue(meetingDetailsView.nonParticipantsGroup, input);
            var objectToAdd = meetingDetailsView.nonParticipantsGroup.splice(index, 1)[0];
            $$("groupSearchInput").define("options", meetingDetailsView.nonParticipantsGroup);
            $$("groupSearchInput").refresh();
            objectToAdd.newEntry = true;
            $$("groupList").add(objectToAdd);
        }

    },

    addMeeting: function () {
        var form = $$("addEditMeetingForm");
        if (form.validate()) {

            var participants = [];
            $$("participantList").data.each(function (obj) {
                participants.push({
                    userId: obj.id,
                    companyId: companyData.id
                });
            });
            $$("groupList").data.each(function (obj) {
                participants.push({
                    userGroupId: obj.id,
                    companyId: companyData.id
                });
            });
            $$("otherList").data.each(function (obj) {
                participants.push({
                    email: obj.value,
                    companyId: companyData.id
                });
            });
            var documents = [];
            $$("documentList").data.each(function (obj) {
                obj.id = null;
                documents.push(obj);
            });
            var newMeeting = {
                start_date: formatter(form.getValues().startTime),
                end_date: formatter(form.getValues().endTime),
                description: form.getValues().description,
                text: form.getValues().topic,
                status: 0,
                companyId: companyData.id,
                userId: userData.id,
                roomId: meetingView.room.id
            };

            var meetingParticipantsDocuments = {
                "meeting": newMeeting,
                "participants": participants,
                "documents": documents
            };

            webix.ajax().headers({
                "Content-type": "application/json"
            }).post("meeting/full", JSON.stringify(meetingParticipantsDocuments)).then(function (result) {
                var resultText = result.text();
                if (resultText) {
                    newMeeting.id = result.json()['meeting'].id;
                    scheduler.addEvent(newMeeting);
                    util.messages.showMessage("Uspješno kreirana rezervacija.");
                } else {
                    util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                }

            }).fail(function (err) {
                util.messages.showErrorMessage(err.responseText);
            });
            util.dismissDialog('addEditMeetingDialog');
        }
    },

    saveEditedMeeting: function () {
        var form = $$("addEditMeetingForm");
        var id = form.elements.id.getValue();
        if (form.validate()) {

            var participants = [];
            $$("participantList").data.each(function (obj) {
                if (obj.newEntry) {
                    participants.push({
                        userId: obj.id,
                        companyId: companyData.id
                    });
                }
            });
            $$("groupList").data.each(function (obj) {
                if (obj.newEntry) {
                    participants.push({
                        userGroupId: obj.id,
                        companyId: companyData.id
                    });
                }
            });
            $$("otherList").data.each(function (obj) {
                if (obj.newEntry) {
                    participants.push({
                        email: obj.value,
                        companyId: companyData.id
                    });
                }
            });
            var documents = [];
            $$("documentList").data.each(function (obj) {
                if (obj.newEntry) {
                    obj.id = null;
                }
                documents.push(obj);
            });

            var editedMeeting = {
                id: id,
                start_date: formatter(form.getValues().startTime),
                end_date: formatter(form.getValues().endTime),
                description: form.getValues().description,
                text: form.getValues().topic,
                status: 0,
                companyId: companyData.id,
                userId: form.getValues().userId,
                roomId: meetingView.room.id
            };

            var meetingParticipantsDocuments = {
                "meeting": editedMeeting,
                "participants": participants,
                "documents": documents
            };

            webix.ajax().headers({
                "Content-type": "application/json"
            }).put("meeting/full/" + id, JSON.stringify(meetingParticipantsDocuments)).then(function (result) {
                var resultText = result.text();
                if (resultText) {
                    scheduler.deleteEvent(id);
                    scheduler.addEvent(editedMeeting);
                    util.messages.showMessage("Uspješna izmjena rezervacija.");

                } else {
                    util.messages.showErrorMessage("Neuspješa izmjena rezervacije!");
                }

            }).fail(function (err) {
                util.messages.showErrorMessage(err.responseText);
            });
            util.dismissDialog('addEditMeetingDialog');
        }
    },
    nonParticipantsUser: [],
    nonParticipantsGroup: []


};

function checkIfValueIsInArray(array, value) {
    for (var i = 0; i < array.length; i++)
        if (array[i].value === value)
            return true;
    return false;
}

function getIndexByValue(array, value) {
    for (var i = 0; i < array.length; i++)
        if (array[i].value === value)
            return i;
    return -1;
}