let packageName = "my-inspectors";
let fs = require("fire-fs");
let path = require('fire-path');

Vue.component('dialog-inspector', {
    template: fs.readFileSync(Editor.url('packages://' + packageName + '/inspector/label-update/dialog.html'), 'utf8'),

    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    data() {
        return {
            mDataEnum : "GameData.instance.score",
            mFixNum : 0
        }
    },
    methods: {
        onSetDataEnum() {
            Editor.Ipc.sendToPanel('scene', 'scene:set-property', {
                id: this.target.uuid.value,
                path: "mDataEnum",
                type: "String",
                value: this.target.mDataEnum.value,
            });
        },
    }
});