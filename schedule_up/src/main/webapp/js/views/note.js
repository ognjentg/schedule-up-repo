var noteView = {
    panel: {
        id: "notePanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-note'></span> Oglasi"
            },{}, {
                id: "addNoteBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte oglas",
                icon: "plus-circle",
                click: "noteView.showAddDialog",
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "noteDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [
                {
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "publishTime",
                editable: false,
                fillspace: false,
                width:150,
                editor: "date",
                header: "Datum objave",
                    format:function(value){
                        date = new Date(value);
                        var hours = date.getHours();
                        var minutes = date.getMinutes();

                        minutes = minutes < 10 ? '0'+minutes : minutes;
                        var strTime = hours + ':' + minutes;
                        return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "  " + strTime;
                         }

            }, {
                    id: "username",
                    fillspace: false,
                    editor: "text",
                    width:200,
                    editable:false,
                    header: "Korisnik"

                }, {
                id: "name",
                editable: false,
                fillspace: false, width:400,
                editor: "text",
                header: "Naziv"

            },
                {
                id: "description",
                fillspace: true,
                editor: "text",
                editable:false,
                header: "Opis"

            }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "note/"
        }]
    },
    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "notePanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));

    }



};