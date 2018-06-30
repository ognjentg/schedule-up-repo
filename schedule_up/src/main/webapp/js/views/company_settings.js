var companySettingsView = {

    firstLoadStart: 0,
    firstLoadEnd: 0,
    firstLoadReminder: 0,
    firstLoadCancel: 0,

    panel: {
        id: "settingsPanel",
        adjust: true,
        width: 1500,
        height: 1500,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                template: "<span class='fa fa-cog'></span> Podešavanja"
            }]
        }, {
            view: "form",
            id: "customizeForm",
            adjust: true,
            elementsConfig: {
                bottomPadding: 18,
                width: 430
            },
            elements: [{
                margin: 5, cols: [

                    {
                        margin: 5, rows: [{
                            id: "timeFrom",
                            name: "timeFrom",
                            view: "datepicker",
                            labelWidth:290,
                            stringResult: true,
                            width: 400,
                            label: "Početak radnog vremena:",
                            timepicker: true,
                            type: "time",
                            format: "%H:%i",
                            on: {
                                onChange: function (item, oldv) {
                                    if (companySettingsView.firstLoadStart++ == 0) {
                                        return;
                                    }
                                    var oldTimeFrom = companyData.timeFrom;
                                    companyData.timeFrom = $$("customizeForm").getValues().timeFrom + ":00";
                                    connection.sendAjax("PUT", "company/" + companyData.id,
                                        function (text, data, xhr) {
                                            if (text && text == "Success") {
                                                util.messages.showMessage("Uspješno ste izmjenili radno vrijeme");
                                            } else {
                                                util.messages.showErrorMessage("Greška pri izmjeni.");
                                                companyData.timeFrom = oldTimeFrom;
                                            }
                                        }, function (text,data,xhr) {
                                            util.messages.showErrorMessage("Greška pri izmjeni.");
                                            companyData.timeFrom = oldTimeFrom;
                                        }, companyData)
                                }
                            }
                            ,
                            suggest: {
                                type: "calendar",
                                body: {
                                    type: "time",
                                    calendarTime: "%H:%i"
                                }
                            }
                        }, {
                            id: "timeTo",
                            width: 400,
                            labelWidth:290,
                            name: "timeTo",
                            view: "datepicker",
                            stringResult: true,
                            label: "Kraj radnog vremena:",
                            timepicker: true,
                            type: "time",
                            format: "%H:%i",
                            on: {
                                onChange: function (item) {

                                    if (companySettingsView.firstLoadEnd++ == 0) {
                                        return;
                                    }
                                    var oldTimeTo = companyData.timeTo;
                                    companyData.timeTo = $$("customizeForm").getValues().timeTo + ":00";
                                    connection.sendAjax("PUT", "company/" + companyData.id,
                                        function (text, data, xhr) {
                                            if (text && text == "Success") {
                                                util.messages.showMessage("Uspješno ste izmjenili radno vrijeme");
                                            } else {
                                                util.messages.showErrorMessage("Greška pri izmjeni.");
                                                companyData.timeTo = oldTimeTo;
                                            }
                                        }, function (text,data,xhr) {

                                            util.messages.showErrorMessage("Greška pri izmjeni.");
                                            companyData.timeTo = oldTimeTo;
                                        }, companyData)
                                }
                            },
                            suggest: {
                                type: "calendar",
                                body: {
                                    type: "time",
                                    calendarTime: "%H:%i"
                                }
                            }
                        }, {
                            id: "reminderTime",
                            view: "combo",
                            labelWidth:290,
                            width: 400,
                            value: "One",
                            options: ["0 minuta", "5 minuta", "15 minuta", "30 minuta", "1 sat", "12 sati", "1 dan"],
                            label: "Podsjetnik:",
                            on: {
                                onChange: function (item, oldv) {

                                    if (companySettingsView.firstLoadReminder++ == 0) {
                                        return;
                                    }

                                    var newReminderTime = $$("reminderTime").getValue();
                                    switch (newReminderTime) {
                                        case "0 minuta": {
                                            newReminderTime = "00:00:00";
                                            break;
                                        }
                                        case "5 minuta": {
                                            newReminderTime = "00:05:00";
                                            break;
                                        }
                                        case "15 minuta": {
                                            newReminderTime = "00:15:00";
                                            break;
                                        }
                                        case "30 minuta": {
                                            newReminderTime = "00:30:00";
                                            break;
                                        }
                                        case "1 sat": {
                                            newReminderTime = "01:00:00";
                                            break;
                                        }
                                        case "12 sati": {
                                            newReminderTime = "12:00:00";
                                            break;
                                        }
                                        case "1 dan": {
                                            newReminderTime = "24:00:00";
                                            break;
                                        }
                                    }

                                    var oldValue = companySettingsView.settings.reminderTime;
                                    companySettingsView.settings.reminderTime = newReminderTime;
                                    connection.sendAjax("PUT", "settings/" + companySettingsView.settings.id,
                                        function (text, data, xhr) {
                                            if (text && text == "Success") {
                                                util.messages.showMessage("Uspješno ste izmjenili podsjetnik");

                                            } else {
                                                companySettingsView.settings.reminderTime = oldValue;
                                                util.messages.showErrorMessage("Greška pri izmjeni.");
                                            }
                                        }, function (text,data,xhr) {
                                            companySettingsView.settings.reminderTime = oldValue;
                                            util.messages.showErrorMessage("Greška pri izmjeni.");

                                        }
                                        , companySettingsView.settings);
                                }
                            }
                        },
                            {
                                view: "combo",
                                id: "cancelTime",
                                labelWidth:290,
                                label: "Minimalno vrijeme za otkazivanje sastanka:",
                                width: 400,
                                options: ["15 minuta", "30 minuta", "1 sat", "12 sati", "1 dan"],
                                on: {
                                    onChange: function (item, oldv) {

                                        if (companySettingsView.firstLoadCancel++ == 0) {
                                            return;
                                        }
                                        var newCancelTime = $$("cancelTime").getValue();
                                        switch (newCancelTime) {
                                            case "0 minuta": {
                                                newCancelTime = "00:00:00";
                                                break;
                                            }
                                            case "5 minuta": {
                                                newCancelTime = "00:05:00";
                                                break;
                                            }
                                            case "15 minuta": {
                                                newCancelTime = "00:15:00";
                                                break;
                                            }
                                            case "30 minuta": {
                                                newCancelTime = "00:30:00";
                                                break;
                                            }
                                            case "1 sat": {
                                                newCancelTime = "01:00:00";
                                                break;
                                            }
                                            case "12 sati": {
                                                newCancelTime = "12:00:00";
                                                break;
                                            }
                                            case "1 dan": {
                                                newCancelTime = "24:00:00";
                                                break;
                                            }
                                        }
                                        var oldValue = companySettingsView.settings.cancelTime;
                                        companySettingsView.settings.cancelTime = newCancelTime;
                                        connection.sendAjax("PUT", "settings/" + companySettingsView.settings.id,
                                            function (text, data, xhr) {
                                                if (text && text == "Success") {
                                                    util.messages.showMessage("Uspješno ste izmjenili minimalno vrijeme otkazivanja.");

                                                } else {
                                                    companySettingsView.settings.cancelTime = oldValue;
                                                    util.messages.showErrorMessage("Greška pri izmjeni.");
                                                }
                                            }, function (text,data,xhr) {
                                                companySettingsView.settings.cancelTime = oldValue;
                                                util.messages.showErrorMessage("Greška pri izmjeni.");

                                            }, companySettingsView.settings);
                                    }
                                }

                            }
                        ]
                    },{
                        rows: [{
                            view:"label",
                            label: "Unesite neradni dan",
                            inputWidth:100,
                            align:"left"

                        },{
                            view:"text",
                            label: "Naziv:",
                            id:"naziv",
                            name:"naziv",
                            value:"proba",
                            inputWidth:400,
                            align:"left"
                        },

                            {
                            id: "holiday",
                            width: 400,
                            name: "holiday",
                            view: "datepicker",
                            stringResult: true,
                            label: "Datum:",
                            timepicker: false,
                            type: "date",
                            format: "%d/%m/%y",
                            suggest: {
                                type: "calendar",
                                body: {
                                    type: "date",
                                    calendarDate: "%d/%m/%y"
                                }
                            }},{
                                id: "addHolidayBtn",
                                view: "button",
                                type: "iconButton",
                                label: "Dodajte",
                                icon: "plus-circle",
                                click: 'companySettingsView.save',
                                autowidth: true
                            }

                        ]
                    },{
                        view: "datatable",
                        css: "webixDatatable",
                        width:400,
                        multiselect: false,
                        id: "holidayDT",
                        resizeColumn: true,
                        resizeRow: true,
                        onContext: {},
                        columns: [{
                            id: "name",
                            editable: false,
                            fillspace: true,
                            editor: "text",
                            sort: "string",
                            header: [
                                "Naziv", {
                                    content: "textFilter"
                                }
                            ]
                        },{id:"companyId",
                        hidden:true
                        },{id:"company_id",
                            hidden:true
                        },
                           {
                                id: "date",
                                fillspace: true,
                                editable: false,
                                editor: "text",
                                sort: "text",
                                header: [
                                    "Datum", {
                                        content: "textFilter"
                                    }
                                ]
                            }
                        ],
                        select: "row",
                        navigation: true,
                        editable: false,
                        url: "holiday",
                        on: {

                            onAfterContextMenu: function (item) {
                                this.select(item.row);
                            }
                        }
                    }
                ]
            }
            ]
        }]
    },
    save:function(){
        var date=$$("customizeForm").getValues().holiday;
        if(date==""){
            util.messages.showErrorMessage("Potrebno je unijeti datum.");
            return;
        }
        var naziv=$$("customizeForm").getValues().naziv;
        console.log(naziv);
        var formatDate=date.split(" ")[0];
        var newHoliday={
            date: formatDate,
            name:naziv,
            companyId: companyData.id};
        $$("naziv").setValue("");
        $$("holiday").setValue("");
       $$("holidayDT").add(newHoliday);
        webix.dp( $$("holidayDT") ).attachEvent("onAfterUpdate", function(id, response){
            if (response.error) console.log(response.error);
        })
    },
    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "settingsPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("holidayDT", "holiday", false);

        webix.ui({
            view: "contextmenu",
            id: "holidayContextMenu",
            width: 200,
            data: [ {
                id: "1",
                value: "Obrišite",
                icon: "trash"
            }],
            master: $$("holidayDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("neradnog dana","neradni dan")));
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    var item = $$("holidayDT").getItem(context.id.row);
                                    $$("holidayDT").detachEvent("onBeforeDelete");
                                    connection.sendAjax("DELETE", "/holiday/" + item.id, function (text, data, xhr) {
                                        if (text) {
                                            console.log(item);
                                            $$("holidayDT").remove(context.id.row);
                                            util.messages.showMessage("Uspjesno uklanjanje");
                                        }
                                    }, function (text, data, xhr) {
                                        util.messages.showErrorMessage("Neuspjesno uklanjanje");
                                    }, item);
                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        })
        companySettingsView.firstLoadStart = companySettingsView.firstLoadEnd =
            companySettingsView.firstLoadCancel = companySettingsView.firstLoadReminder = 0;

        connection.sendAjax("GET", "settings/getByCompanyId/" + companyData.id,
            function (text, data, xhr) {
                companySettingsView.settings = data.json();
                var time;
                var cancelTime;
                if (text) {
                    switch (companySettingsView.settings.reminderTime) {
                        case "00:00:00": {
                            time = "0 minuta";
                            break;
                        }
                        case "00:05:00": {
                            time = "5 minuta";
                            break;
                        }
                        case "00:15:00": {
                            time = "15 minuta";
                            break;
                        }
                        case "00:30:00": {
                            time = "30 minuta";
                            break;
                        }
                        case "01:00:00": {
                            time = "1 sat";
                            break;
                        }
                        case "12:00:00": {
                            time = "12 sati";
                            break;
                        }
                        case "24:00:00": {
                            time = "1 dan ";
                            break;
                        }


                    }
                    switch (companySettingsView.settings.cancelTime) {
                        case "00:00:00": {
                            cancelTime = "0 minuta";
                            break;
                        }
                        case "00:05:00": {
                            cancelTime = "5 minuta";
                            break;
                        }
                        case "00:15:00": {
                            cancelTime = "15 minuta";
                            break;
                        }
                        case "00:30:00": {
                            cancelTime = "30 minuta";
                            break;
                        }
                        case "01:00:00": {
                            cancelTime = "1 sat";
                            break;
                        }
                        case "12:00:00": {
                            cancelTime = "12 sati";
                            break;
                        }
                        case "24:00:00": {
                            cancelTime = "1 dan";
                            break;
                        }

                    }
                    $$("reminderTime").setValue(time);
                    $$("cancelTime").setValue(cancelTime);
                } else
                    util.messages.showErrorMessage("Greška pri učitavanju.");
            }, function () {
                util.messages.showErrorMessage("Greška pri učitavanju.");
            }, null);

        $$("timeTo").setValue(companyData.timeTo);
        $$("timeFrom").setValue(companyData.timeFrom);

    }
};
