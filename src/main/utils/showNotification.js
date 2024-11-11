import {Notification} from "electron"

export default function showNotification(title, body){
  new Notification({title: title, body: body, icon: "icon.ico"}).show()
}
