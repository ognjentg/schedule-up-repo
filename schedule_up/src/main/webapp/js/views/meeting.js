var contextMenu;
var holidays;
var formatter = webix.Date.dateToStr("%d-%m-%Y %H:%i");
var parser = webix.Date.strToDate("%d-%m-%Y %H:%i");
var meetingView = {

    room: null,
    panel: {
        id: "meetingPanel",
        adjust: true,
        rows: [{
            view: "template",
            template: "<div id='scheduler_room_name' class='room-name-scheduler'></div><div id='scheduler_there' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div><div class=\"dhx_cal_tab\" name=\"day_tab\" style=\"right:204px;\"></div>\n" +
                "        <div class=\"dhx_cal_tab\" name=\"week_tab\" style=\"right:140px;\"></div>\n" +
                "        <div class=\"dhx_cal_tab\" name=\"month_tab\" style=\"right:76px;\"></div></div><div class='dhx_cal_header'></div><div id='scheduler_data' class='dhx_cal_data'></div></div>",
        }
        ]
    },
    contextMenuEventId: null,


    selectPanel: function (room) {
        detachAllEvents();
        webix.protoUI({
            name: "activeList"
        }, webix.ui.list, webix.ActiveContent);
        $$("main").removeView(rightPanel);
        meetingView.room = room;
        rightPanel = "meetingPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        scheduler.clearAll();
        document.getElementById("scheduler_room_name").innerHTML = room.name;
        var event = scheduler.attachEvent("onEmptyClick", function (date, e) {
            if (date > new Date() && checkIfNotHoliday(date)) {
                meetingDetailsView.showAddDialog(date);
            }
        });
        schedulerEvents.push(event);

        schedulerEvents.push(scheduler.attachEvent("onClick", function (id, e) {
            meetingDetailsView.showEventInfo(id);
        }));

        scheduler.config.xml_date = "%d-%m-%Y %H:%i";
        scheduler.config.readonly = true;
        scheduler.config.first_hour = parseInt(companyData.timeFrom.substr(0, 2));

        schedulerEvents.push(scheduler.attachEvent("onEventLoading", function (ev) {
            if (ev.status !== 0 && ev.userId === userData.id)
                ev.color = "#bdd5ff";
            else if (ev.status === 0 && ev.userId !== userData.id)
                ev.color = "#3d454c";
            else if (ev.status !== 0 && ev.userId !== userData.id)
                ev.color = "#8798a8";

            return true;
        }));

        webix.ajax("holiday").then(function (result) {
            holidays = JSON.parse(result.text());
            for (var i = 0; i < holidays.length; i++) {
                var holiday = holidays[i];
                scheduler.blockTime(
                    new Date(holiday.date),
                    "fullday"
                );

            }
            scheduler.init('scheduler_there', new Date(), "week");
            scheduler.load("meeting/getByRoom/" + room.id, "json");
        });


        schedulerEvents.push(scheduler.attachEvent("onContextMenu", function (id, e) {
            var activeEventMenu = [
                {
                    id: 1,
                    value: "Izmijenite",
                    icon: "edit"
                },
                {
                    $template: "Separator"
                },
                {
                    id: 2,
                    value: "Zatvorite",
                    icon: "check"
                },
                {
                    $template: "Separator"
                },
                {
                    id: 4,
                    value: "Otkažite",
                    icon: "times"
                }
            ];
            var finishedEventMenu = [
                {
                    id: 3,
                    value: "Dodajte izvještaj",
                    icon: "file"
                }
            ];
            if (id != null && (userData.roleId === 2 || scheduler.getEvent(id).userId === userData.id)) {
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
                        width: 170,
                        on: {
                            onItemClick: function (id) {
                                // Property meetingView.contextMenuEventId je id eventa na koji smo kliknuli.
                                switch (id) {
                                    case "1":
                                        meetingDetailsView.showEditDialog(meetingView.contextMenuEventId);
                                        break;
                                    case "2":
                                        var delBox = (webix.copy(meetingView.finishMeetingDialog));
                                        delBox.callback = function (result) {
                                            if (result == 1) {
                                                webix.ajax().put("meeting/finish/" + meetingView.contextMenuEventId).then(function (result) {
                                                    if (result.text()) {
                                                        var ev = scheduler.getEvent(meetingView.contextMenuEventId);
                                                        ev.status = 1;
                                                        ev.color = "#bdd5ff";
                                                        scheduler.updateEvent(ev.id);
                                                        util.messages.showMessage("Sastanak uspješno zatvoren");
                                                    }
                                                }).fail(function (err) {
                                                    util.messages.showErrorMessage(err.responseText());
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
                                            if (result == 1) {
                                                webix.ajax().put("meeting/cancel/" + meetingView.contextMenuEventId).then(function (result) {
                                                    if (result.text()) {
                                                        scheduler.deleteEvent(meetingView.contextMenuEventId);
                                                        util.messages.showMessage("Sastanak uspješno otkazan");
                                                    }
                                                }).fail(function (err) {
                                                    if (err.responseText) {
                                                        util.messages.showErrorMessage(err.responseText);
                                                    } else {
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
                    contextMenu.define("data", scheduler.getEvent(id).status === 0 ? activeEventMenu : finishedEventMenu);
                    contextMenu.refresh();
                    contextMenu.show({
                        x: posx,
                        y: posy
                    });
                } else {
                    contextMenu.clearAll();
                    contextMenu.define("data", scheduler.getEvent(id).status === 0 ? activeEventMenu : finishedEventMenu);
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


    finishMeetingDialog: {
        title: "Zatvaranje sastanka",
        ok: "Da",
        cancel: "Ne",
        width: 500,
        text: "Da li ste sigurni da želite da zatvorite sastanak?"
    },
    cancelMeetingDialog: {
        title: "Otkazivanje sastanka",
        ok: "Da",
        cancel: "Ne",
        width: 500,
        text: "Da li ste sigurni da želite da otkažete sastanak?"
    },
    addReportDialog: {
        view: "popup",
        id: "addReportDialog",
        modal: true,
        position: "center",
        meetingId: null,
        body: {
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            width: 200,
                            label: "<span class='webix icon_delete fa fa-file'/> Dodavanje izvještaja"
                        },
                        {},
                        {
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addReportDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: "label",
                            width: 150,
                            label: "Dodajte dokumente"
                        },
                        {},
                        {
                            view: "uploader",
                            id: "reportUploader",
                            width: 32,
                            height: 32,
                            css: "upload",
                            template: "<span class='webix fa fa-upload' /></span>",
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
                    view: "list",
                    id: "reportList",
                    autowidth: true,
                    height: 200,
                    css: "relative",
                    template: "<div class='list-name'>#name#</div> <span class='delete-file'><span class='webix fa fa-close'/></span>",
                    onClick: {
                        'delete-file': function (e, id) {
                            this.remove(id);
                            return false;
                        },
                        'list-name': function (e, id) {
                            var item = $$("reportList").getItem(id);
                            var blob = util.b64toBlob(item.content);
                            saveFileAs(blob, item.name);
                            return false;
                        }
                    }
                },
                {
                    view: "button",
                    width: 140,
                    value: "Dodajte izvještaj",
                    click: function () {
                        var list = $$("reportList");
                        if (list.count() === 0) {
                            util.messages.showErrorMessage("Nije odabran nijedan dokument!");
                            return;
                        }
                        var reports = [];
                        list.data.each(function (report) {
                            report.id = null;
                            reports.push(report);
                        });

                        webix.ajax().headers({
                            "Content-type": "application/json"
                        }).post("document/list/", JSON.stringify(reports)).then(function (result) {
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
        if (util.popupIsntAlreadyOpened("addReportDialog")) {
            var dialog = webix.ui(webix.copy(meetingView.addReportDialog));
            meetingView.addReportDialog.meetingId = meetingId;
            dialog.show();
        }
    }


};

var checkIfNotHoliday = function (date) {

    var probe = {
        start_date: new Date(date),
        end_date: scheduler.date.add(date, scheduler.config.time_step, "minute")
    };
    return scheduler.checkLimitViolation(probe);
};