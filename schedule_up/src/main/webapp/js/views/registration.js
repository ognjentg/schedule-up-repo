var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
var registrationView = {
    panel: {
        id: "registrationPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                template: "<span class='fa fa-user'></span> Registracija"
            }]
        }, { view: "form",
            width:x,
            height:y,
            id: "registrationForm",
            elementsConfig: {
                bottomPadding: 20
            },
            elements: [{
                view: "text",
                width:400,
                align:"center",
                id: "username",
                name: "username",
                label: "Korisničko ime:",
                labelWidth:118,
                labelAlign:'left',
                invalidMessage: "Unesite korisničko ime!",
                required: true
            },{
                view: "text",
                name: "base64ImageUser",
                hidden: true
            },{
                view: "text",
                id: "password",
                name: "password",
                type:"password",
                width:400,
                align:"center",
                label: "Šifra:",
                labelAlign:'right',
                invalidMessage: "Unesite šifru!",
                required: true
            },

                {view: "text",
                    id: "firstname",
                    name: "firstname",
                    width:400,
                    align:"center",
                    label: "Ime:",
                    invalidMessage: "Unesite ime!",
                    labelAlign:'right',
                    required: true
                },
                {view: "text",
                    id: "lastname",
                    name: "lastname",
                    width:400,
                    align:"center",
                    label: "Prezime:",
                    invalidMessage: "Unesite prezime!",
                    labelAlign:'right',
                    required: true
                },
                {
                    view:"uploader",
                    value:"Fotografija",
                    accept:"image/jpeg, image/png",
                    autosend:false,
                    width:200,
                    align:"center",
                    multiple:false,
                    on:{
                        onBeforeFileAdd: function(upload){
                            var file = upload.file;
                            var reader = new FileReader();
                            reader.onload = function(event) {
                                // console.log(event.target.result);
                                $$("tmpWin").show();
                                $$("tmp").setValues({src:event.target.result});
                                var form = $$("registrationForm");
                                form.elements.base64ImageUser.setValue(event.target.result.split("base64,")[1]);

                            };
                            reader.readAsDataURL(file)
                            return false;
                        }
                    }
                },

                {
                    margin:5,
                    id: "saveBuilding",
                    view: "button",
                    align:"center",
                    value: "Registrujte se",
                    type: "form",
                    click: "registrationView.saveUser",
                    hotkey: "enter",
                    width:200,

                }],
            rules: {
                "username": function (value) {
                    if (!value)
                        return false;
                    if (value.length > 100) {
                        $$('registrationForm').elements.username.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                        return false;
                    }
                    return true;
                },
                "password":function (value) {
                    if (!value)
                        return false;

                    return true;
                }
                ,
                "firstname": function (value) {
                    if (!value)
                        return false;
                    if (value.length > 100) {
                        $$('registrationForm').elements.firstname.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                        return false;
                    }
                    return true;
                },
                "lastname": function (value) {
                    if (!value)
                        return false;
                    if (value.length > 100) {
                        $$('registrationForm').elements.lastname.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                        return false;
                    }
                    return true;
                },

            }}]
    },


    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "registrationPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));

    },
    saveUser: function () {

        if ($$("registrationForm").validate()) {
            var newItem = {
                id: userForRegistration['id'],
                email:userForRegistration['email'],
                active:1,
                deleted:0,
                companyId:userForRegistration['companyId'],
                roleId:userForRegistration['roleId'],
                username: $$("registrationForm").getValues().username,
                password: $$("registrationForm").getValues().password,
                firstName: $$("registrationForm").getValues().firstname,
                lastName: $$("registrationForm").getValues().lastname,
                photo:$$("registrationForm").getValues().base64ImageUser,

            };
            connection.sendAjax("POST", "user/registration",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Uspješna registracija.");
                        userForRegistration=null;
                        userData = null;
                        companyData = null;
                        connection.reload();

                    } else
                        util.messages.showErrorMessage("Neuspješna registracija.");
                }, function (text, data, xhr) {
                    util.messages.showErrorMessage(text);
                }, newItem);

        }
    },
    hide:function(){
        $$("tmpWin").hide();
    }


};
webix.ui({
    view:"popup",
    id:"tmpWin",
    position:"center",
    close:true,
    body:{
        rows: [{
            view: "toolbar",
            cols: [{
                view: "label",
                label: "<span class='webix_icon fa fa-image'></span> Korisnička slika",
                width: 400
            }, {}, {
                hotkey: 'esc',
                view: "icon",
                icon: "close",
                align: "right",
                click: "registrationView.hide",
            }]
        }, {
            id:"tmp",
            view:"template",
            template:"<img src='#src#' style='width: 100%;height: 100%; max-width:100%; alignment: center; max-height:100%'></img>",
            width:500,
            autoheight:true
        },
            {
                view:"uploader",
                value:"Izmjena fotografije",
                accept:"image/jpeg, image/png",
                autosend:false,
                width:200,
                align:"center",
                multiple:false,
                on:{
                    onBeforeFileAdd: function(upload){
                        var file = upload.file;
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            // console.log(event.target.result);
                            $$("tmp").setValues({src:event.target.result});
                            var form = $$("registrationForm");
                            form.elements.base64ImageUser.setValue(event.target.result.split("base64,")[1]);
                            //  $$("tmpWin").show()
                        };
                        reader.readAsDataURL(file)
                        return false;
                    }
                }
            }
        ]}
})