var companyView = {
    panel: {
        id: "companyPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-briefcase'></span> Kompanije"
            }, {}, {
                id: "addCompanyBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte kompaniju",
                icon: "plus-circle",
                click: 'companyView.showAddDialog',
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "companyDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "name",
                fillspace: true,
                editor: "text",
                sort: "string",
                header: [
                    "Naziv", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "timeFrom",
                fillspace: true,
                editor: "text",
                header: ["Radno vrijeme od",
                    {
                        content: "textFilter"
                    }]
            },
                {
                    id: "timeTo",
                    fillspace: true,
                    editor: "text",
                    header: ["Radno vrijeme do",{
                        content: "textFilter"
                    }],
                }, {
                    id: "email",
                    fillspace: true,
                    editor: "text",
                    sort: "text",
                    header: [
                        "E-mail", {
                            content: "textFilter"
                        }
                    ]
                }
            ],
            select: "row",
            navigation: true,
            editable: "false",
            url: "company/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "companyPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));


        webix.ui({
            view: "contextmenu",
            id: "companyContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Edit",
                icon: "pencil-square-o"
            }, {
                $template: "Separator"
            }, {
                id: "2",
                value: "Delete",
                icon: "trash"
            }],
            master: $$("companyDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            companyView.showChangeCompanyDialog($$("companyDT").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.deleteConfirm("company")));
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    connection.sendAjax("DELETE")
                                    $$("companyDT").remove(context.id.row);
                                    util.messages.showMessage("Company deleted successfully.");
                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        });
    },

    addDialog: {
        view: "popup",
        id: "addCompanyDialog",
        modal: true,
        position: "center",
        body: {
            id: "addCompanyInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-briefcase'></span> Add company",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addCompanyDialog');"
                }]
            }, {
                view: "form",
                id: "addCompanyForm",
                width: 500,
                elementsConfig: {
                    labelWidth: 140,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Name:",
                    invalidMessage: "Enter company name!",
                    required: true
                }, {
                    id: "timeFrom",
                    invalidMessage:"Enter time from!",
                    name: "timeFrom",
                    view: "datepicker",
                    stringResult: true,
                    label: "Time from",
                    timepicker: true,
                    type: "time",
                    required: true,
                    format: "%H:%i",
                    suggest: {
                        type: "calendar",
                        body: {
                            type: "time",
                            calendarTime: "%H:%i"
                        }
                    }
                }, {
                    id: "timeTo",
                    name: "timeTo",
                    view: "datepicker",
                    invalidMessage:"Enter time to!",
                    stringResult: true,
                    label: "Time to",
                    timepicker: true,
                    type: "time",
                    required: true,
                    format: "%H:%i",
                    suggest: {
                        type: "calendar",
                        body: {
                            type: "time",
                            calendarTime: "%H:%i"
                        }
                    }
                },
                    {
                        view: "text",
                        id: "email",
                        name: "email",
                        label: "E-mail:",
                        required: true
                    }, {
                        margin: 5,
                        cols: [{}, {
                            id: "saveCompany",
                            view: "button",
                            value: "Save",
                            type: "form",
                            click: "companyView.save",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addCompanyForm').elements.name.config.invalidMessage = 'Up to 100 characters allowed';
                            return false;
                        }
                        return true;
                    },
                    "email":function (value) {
                        if (!value) {
                            $$('addCompanyForm').elements.email.config.invalidMessage = 'Enter E-mail!';
                            return false;
                        }
                        if (value.length > 100) {
                            $$('addCompanyForm').elements.email.config.invalidMessage = 'Up to 100 characters allowed';
                            return false;
                        }
                        if(!webix.rules.isEmail(value)) {
                            $$('addCompanyForm').elements.email.config.invalidMessage = 'Email is not in valid format.';
                            return false;
                        }

                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        webix.ui(webix.copy(companyView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addCompanyForm");
        if (form.validate()) {
            var newCompany = {
                name: form.getValues().name,
                timeFrom: form.getValues().timeFrom + ":00",
                timeTo: form.getValues().timeTo + ":00",
                deleted:0
            };
            var newUser = {
                email: form.getValues().email,
                deleted:0,
                active:0,
                roleId:1,

            };
            connection.sendAjax("POST", "company", function (text, data, xhr) {
                var addedCompany = data.json();
                newUser.companyId=addedCompany.id;

                connection.sendAjax("POST", "user", function (text, data, xhr) {
                    addedCompany.email = data.json().email;
                    $$("companyDT").add(addedCompany);
                    util.messages.showMessage("Company added successfully.");
                }, function () {
                    connection.sendAjax("DELETE","company/"+addedCompany.id,function(text,data,xhr){
                        util.messages.showErrorMessage("Company cannot be added!");

                    },function(){
                        util.messages.showErrorMessage("If this happened,backend is to blame.");
                    },{});

                }, newUser);
            }, function () {

                util.messages.showErrorMessage("Company cannot be added!");
            }, newCompany);

            util.dismissDialog('addCompanyDialog');
        }
    }

    ,

    changeCompanyDialog: {
        view: "popup",
        id: "changeCompanyDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeCompanyInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-book'></span> Change company data",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeCompanyDialog');"
                }]
            }, {
                view: "form",
                id: "changeCompanyForm",
                width: 500,
                elementsConfig: {
                    labelWidth: 140,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    name: "id",
                    hidden: true
                }, {
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Name:",
                    invalidMessage: "Enter company name!",
                    required: true
                }, {
                    view: "text",
                    id: "ects",
                    name: "ects",
                    label: "ECTS:",
                    required: true
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveChangedCompany",
                        view: "button",
                        value: "Save",
                        type: "form",
                        click: "companyView.saveChangedCompany",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        return true;
                    },
                    "ects": function (value) {
                        if (!value) {
                            $$('addCompanyForm').elements.ects.config.invalidMessage = 'Enter ECTS!';
                            return false;
                        }
                        else if (isNaN(value)) {
                            $$('addCompanyForm').elements.ects.config.invalidMessage = 'ECTS must be a number';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showChangeCompanyDialog: function (company) {
        webix.ui(webix.copy(companyView.changeCompanyDialog));
        var form = $$("changeCompanyForm");
        form.elements.id.setValue(company.id);
        form.elements.name.setValue(company.name);
        form.elements.ects.setValue(company.ects);

        setTimeout(function () {
            $$("changeCompanyDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedCompany: function () {
        if ($$("changeCompanyForm").validate()) {
            var newItem = {
                id: $$("changeCompanyForm").getValues().id,
                name: $$("changeCompanyForm").getValues().name,
                ects: $$("changeCompanyForm").getValues().ects
            };

            connection.sendAjax("PUT", "company",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Data successfully changed.");
                        $$("companyDT").updateItem(newItem.id, newItem);
                    } else
                        util.messages.showErrorMessage("Data not successfully changed.");
                }, function () {
                    util.messages.showErrorMessage("Data not successfully changed.");
                }, newItem);

            util.dismissDialog('changeCompanyDialog');
        }
    }
};