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
            editable:true,
            editaction:"dblclick",
            multiselect: false,
            id: "companyDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            },{
                id:"companyLogo",
                fillspace:true,
                header:{text:"Logo", css:"wrap-line"},
                template:"<img src='data:image/jpg;base64,#companyLogo#'/>"

            } ,{
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
                format: function (value) {
                    return value.substring(0, value.length - 3);
                },
                header: ["Radno vrijeme od",
                    {
                        content: "textFilter"
                    }]
            },
                {
                    id: "timeTo",
                    fillspace: true,
                    editor: "text",
                    format: function (value) {
                        return value.substring(0, value.length - 3);
                    },
                    header: ["Radno vrijeme do", {
                        content: "textFilter"
                    }],
                }, {
                    id: "email",
                    fillspace: true,
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
            url: "company",
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
        connection.attachAjaxEvents("companyDT", "company", true);


        webix.ui({
            view: "contextmenu",
            id: "companyContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Izmijenite",
                icon: "pencil-square-o"
            }, {
                $template: "Separator"
            }, {
                id: "2",
                value: "Obrišite",
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
                                    var item = $$("companyDT").getItem(context.id.row);
                                    $$("companyDT").detachEvent("onBeforeDelete");
                                    connection.sendAjax("DELETE", "/company/" + item.id, function (text, data, xhr) {
                                        if (text) {
                                            $$("companyDT").remove(context.id.row);
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
                    label: "<span class='webix_icon fa-briefcase'></span> Dodavanje kompanije",
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
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv:",
                    invalidMessage: "Unesite naziv kompanije!",
                    required: true
                }, {
                    id: "timeFrom",
                    invalidMessage: "Unesite početak radnog vremena!",
                    name: "timeFrom",
                    editable:true,
                    view: "datepicker",
                    stringResult: true,
                    label: "Početak radnog vremena:",
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
                    editable:true,
                    invalidMessage: "Unesite kraj radnog vremena!",
                    stringResult: true,
                    label: "Kraj radnog vremena:",
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
                    },
                    {
                        height:50,
                        cols:[
                            {
                                view:"label",
                                width:200,
                                bottomPadding:18,
                                leftPadding:3,
                                required:true,
                                label:"Logo kompanije: <span style='color:#e32'>*</span>"
                            },
                            {
                                view:"list",
                                name:"companyLogoList",
                                rules:{
                                    content:webix.rules.isNotEmpty
                                },
                                scroll:false,
                                id:"companyLogoList",
                                width:290,
                                type: {
                                    height: "auto"
                                },
                                css:"relative image-upload",
                                template:"<img src='data:image/jpg;base64,#content#'/> <span class='delete-file'><span class='webix fa fa-close'/></span>",
                                onClick:{
                                    'delete-file':function (e,id) {
                                        this.remove(id);
                                        return false;
                                    }
                                }
                            },{},
                            {
                                view:"uploader",
                                id:"photoUploader",
                                width:24,
                                height:24,
                                css:"upload-photo",
                                template:"<span class='webix fa fa-upload' /></span>",
                                on: {
                                    onBeforeFileAdd: function (upload) {
                                        var type = upload.type.toLowerCase();
                                        if (type != "jpg" && type != "png"){
                                            util.messages.showErrorMessage("Dozvoljene ekstenzije  su jpg i png!")
                                            return false;
                                        }
                                        var file = upload.file;
                                        var reader = new FileReader();
                                        reader.onload = function (event) {
                                            var img=new Image();
                                            img.onload=function (ev) {
                                                if (img.width===220&& img.height===50) {
                                                    var newDocument = {
                                                        name: file['name'],
                                                        content: event.target.result.split("base64,")[1],
                                                    };
                                                    $$("companyLogoList").clearAll();
                                                    $$("companyLogoList").add(newDocument);
                                                }else{
                                                    util.messages.showErrorMessage("Dimenzije logoa moraju biti 220x50 px!")
                                                }
                                            };
                                            img.src=event.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                        return false;
                                    }
                                }
                            },
                        ]
                    },
                    {
                        height:18,
                        cols:[

                            {},
                            {
                                id:"invalidLabel",
                                view:"label",
                                label:"Odaberite logo kompanije!",
                                css:" invalid-message-photo-alignment",
                                hidden:true

                            },
                            {}
                        ]
                    }
                    ,

                    {
                        margin: 5,
                        cols: [{}, {
                            id: "saveCompany",
                            view: "button",
                            value: "Dodajte kompaniju",
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
                            $$('addCompanyForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "email": function (value) {
                        if (!value) {
                            $$('addCompanyForm').elements.email.config.invalidMessage = 'Unesite E-mail!';
                            return false;
                        }
                        if (value.length > 100) {
                            $$('addCompanyForm').elements.email.config.invalidMessage = 'Maksimalan broj karaktera je 100';
                            return false;
                        }
                        if (!webix.rules.isEmail(value)) {
                            $$('addCompanyForm').elements.email.config.invalidMessage = 'E-mail nije u validnom formatu.';
                            return false;
                        }

                        return true;
                    },
                    "timeTo":function (value) {
                        if (!value) {
                            $$('addCompanyForm').elements.timeTo.config.invalidMessage = 'Unesite kraj radnog vremena';
                            return false;
                        }

                        if (value <= $$('addCompanyForm').getValues().timeFrom){
                            $$('addCompanyForm').elements.timeTo.config.invalidMessage = 'Kraj radnog vremena mora biti poslije početka!    ';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        if (util.popupIsntAlreadyOpened("addCompanyDialog")) {
            webix.ui(webix.copy(companyView.addDialog)).show();
            webix.UIManager.setFocus("name");
        }
    },

    save: function () {
        var form = $$("addCompanyForm");
        var logo=$$("companyLogoList");
        var photoValidation=logo.count()===1;
        if (!photoValidation){
            webix.html.addCss(logo.getNode(),"image-upload-invalid");
            $$("invalidLabel").show();
        }else{
           webix.html.removeCss(logo.getNode(),"image-upload-invalid");
            $$("invalidLabel").hide();
        }
        var validation=form.validate();
        if (validation && photoValidation) {
            var newCompany = {
                name: form.getValues().name,
                timeFrom: form.getValues().timeFrom + ":00",
                timeTo: form.getValues().timeTo + ":00",
                email: form.getValues().email,
                companyLogo: logo.getItem(logo.getLastId()).content
            };
            $$("companyDT").add(newCompany);
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
                    label: "<span class='webix_icon fa-briefcase'></span> Izmjena kompanije",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeCompanyDialog');"
                }]
            }, {
                view: "form",
                id: "changeCompanyForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    name: "id",
                    hidden: true
                },{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv:",
                    invalidMessage: "Unesite naziv kompanije!",
                    required: true
                }, {
                    id: "timeFrom",
                    invalidMessage: "Unesite početak radnog vremena!",
                    name: "timeFrom",
                    view: "datepicker",
                    editable:true,
                    stringResult: true,
                    label: "Početak radnog vremena:",
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
                    editable:true,
                    invalidMessage: "Unesite kraj radnog vremena!",
                    stringResult: true,
                    label: "Kraj radnog vremena:",
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
                    },
                    {
                        height:50,
                        cols:[
                            {
                                view:"label",
                                width:200,
                                bottomPadding:18,
                                leftPadding:3,
                                required:true,
                                label:"Logo kompanije: <span style='color:#e32'>*</span>"
                            },
                            {
                                view:"list",
                                id:"changeCompanyLogoList",
                                name:"changeCompanyLogoList",
                                rules:{
                                    content:webix.rules.isNotEmpty
                                },
                                scroll:false,
                                id:"changeCompanyLogoList",
                                width:290,
                                type: {
                                    height: "auto"
                                },
                                css:"relative image-upload",
                                template:"<img src='data:image/jpg;base64,#content#'/> <span class='delete-file'><span class='webix fa fa-close'/></span>",
                                onClick:{
                                    'delete-file':function (e,id) {
                                        this.remove(id);
                                        return false;
                                    }
                                }
                            },{},
                            {
                                view:"uploader",
                                id:"photoUploader",
                                width:24,
                                height:24,
                                css:"upload-photo",
                                template:"<span class='webix fa fa-upload' /></span>",
                                on: {
                                    onBeforeFileAdd: function (upload) {
                                        var type = upload.type.toLowerCase();
                                        if (type != "jpg" && type != "png"){
                                            util.messages.showErrorMessage("Dozvoljene ekstenzije  su jpg i png!")
                                            return false;
                                        }
                                        var file = upload.file;
                                        var reader = new FileReader();
                                        reader.onload = function (event) {
                                            var img=new Image();
                                            img.onload=function (ev) {
                                                if (img.width===220&& img.height===50) {
                                                    var newDocument = {
                                                        name: file['name'],
                                                        content: event.target.result.split("base64,")[1],
                                                    };
                                                    $$("changeCompanyLogoList").clearAll();
                                                    $$("changeCompanyLogoList").add(newDocument);
                                                }else{
                                                    util.messages.showErrorMessage("Dimenzije logoa moraju biti 220x50 px!")
                                                }
                                            };
                                            img.src=event.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                        return false;
                                    }
                                }
                            },
                        ]
                    },
                    {
                        height:18,
                        cols:[

                            {},
                            {
                                id:"invalidLabel",
                                view:"label",
                                label:"Odaberite logo kompanije!",
                                css:" invalid-message-photo-alignment",
                                hidden:true

                            },
                            {}
                        ]
                    }
                    ,

                    {
                        margin: 5,
                        cols: [{}, {
                            id: "changeCompany",
                            view: "button",
                            value: "Sačuvajte izmjene",
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
                        if (value.length > 100) {
                            $$('changeCompanyForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "email": function (value) {
                        if (!value) {
                            $$('changeCompanyForm').elements.email.config.invalidMessage = 'Unesite E-mail!';
                            return false;
                        }
                        if (value.length > 100) {
                            $$('changeCompanyForm').elements.email.config.invalidMessage = 'Maksimalan broj karaktera je 100';
                            return false;
                        }
                        if (!webix.rules.isEmail(value)) {
                            $$('changeCompanyForm').elements.email.config.invalidMessage = 'E-mail nije u validnom formatu.';
                            return false;
                        }

                        return true;
                    },
                    "timeTo":function (value) {
                        if (!value) {
                            $$('changeCompanyForm').elements.timeTo.config.invalidMessage = 'Unesite kraj radnog vremena';
                            return false;
                        }

                        if (value <= $$('changeCompanyForm').getValues().timeFrom){
                            $$('changeCompanyForm').elements.timeTo.config.invalidMessage = 'Kraj radnog vremena mora biti poslije početka!    ';
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
        form.elements.timeFrom.setValue(company.timeFrom);
        form.elements.timeTo.setValue(company.timeTo);
        form.elements.email.setValue(company.email);

        setTimeout(function () {
            $$("changeCompanyDialog").show();
            webix.UIManager.setFocus("name");
            var newDocument = {
                name: '',
                content: company.companyLogo,
            };
            $$("changeCompanyLogoList").clearAll();
            $$("changeCompanyLogoList").add(newDocument);
        }, 0);


    },


    saveChangedCompany: function () {
        var form = $$("changeCompanyForm");
        var logo=$$("changeCompanyLogoList");
        var photoValidation=logo.count()===1;
        if (!photoValidation){
            webix.html.addCss(logo.getNode(),"image-upload-invalid");
            $$("invalidLabel").show();
        }else{
            webix.html.removeCss(logo.getNode(),"image-upload-invalid");
            $$("invalidLabel").hide();
        }
        var validation=form.validate();
        if (validation && photoValidation) {
            var newCompany = {
                id: form.getValues().id,
                name: form.getValues().name,
                timeFrom: form.getValues().timeFrom + ":00",
                timeTo: form.getValues().timeTo + ":00",
                email: form.getValues().email,
                companyLogo: logo.getItem(logo.getLastId()).content
            };
            connection.sendAjax("PUT", "company/custom/" + newCompany.id,
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Kompanija uspješno izmjenjena.");
                        $$("companyDT").updateItem(newCompany.id, newCompany);
                    } else
                        util.messages.showErrorMessage("Neuspješna izmjena.");
                }, function () {
                    util.messages.showErrorMessage("Neuspješna izmjena.");
                }, newCompany);

            util.dismissDialog('changeCompanyDialog');
        }

    }
};
