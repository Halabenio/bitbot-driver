enum RadioMessage {
    message1 = 49434,
    Occupied = 8782,
    CarKeepalive = 29201,
    ControllerKeepalive = 30085
}
input.onButtonPressed(Button.A, function () {
    if (Status == 1) {
        SettingNumber += -1
        if (SettingNumber < 0) {
            SettingNumber = 20
        }
        basic.showNumber(SettingNumber)
    }
})
input.onButtonPressed(Button.AB, function () {
    if (Status == 0) {
        Status = 1
        SettingNumber = parseFloat(flashstorage.getOrDefault("Gateway", "0"))
        basic.showNumber(SettingNumber)
        bitbot.setLedColor(0xFF8000)
    } else if (Status == 1) {
        Gateway = SettingNumber
        flashstorage.put("Gateway", convertToText(SettingNumber))
        radio.setGroup(Gateway * 10)
        serial.writeNumber(Gateway * 10)
        uid = randint(0, 9999999)
        Status = 2
        bitbot.setLedColor(0x0000FF)
        radio.sendValue("CarAwait", uid)
    } else if (Status == 2) {
        Status = 1
        SettingNumber = parseFloat(flashstorage.getOrDefault("Gateway", "0"))
        basic.showNumber(SettingNumber)
        bitbot.setLedColor(0xFF8000)
    } else if (Status == 3) {
    	
    }
})
input.onButtonPressed(Button.B, function () {
    if (Status == 1) {
        SettingNumber += 1
        if (SettingNumber > 20) {
            SettingNumber = 0
        }
        basic.showNumber(SettingNumber)
    }
})
radio.onReceivedValue(function (name, value) {
    serial.writeValue(name, value)
    if (name == "CarDisp") {
        basic.showNumber(value)
        Status = 3
        bitbot.setLedColor(0x18E600)
        radio.setGroup(Gateway * 10 + value)
        serial.writeNumber(Gateway * 10 + value)
        Address = Gateway * 10 + value
    } else if (name == "GateFull") {
        Status = 4
        for (let index = 0; index < 8; index++) {
            bitbot.setPixelColor(0, 0xff0000)
            bitbot.ledRotate(true, BBArms.Both)
            bitbot.ledRotate(true, BBArms.Both)
        }
    } else if (name == "IsCar") {
        radio.sendValue("CarHere", 0)
    } else if (name == "DrPacket") {
        bitbot.move(BBMotor.Left, BBDirection.Forward, parseFloat(convertToText(value).substr(1, 3)))
        bitbot.move(BBMotor.Right, BBDirection.Forward, parseFloat(convertToText(value).substr(4, 3)))
        radio.sendValue("Driving", 0)
    } else if (name == "CarHere") {
        radio.setGroup(Gateway * 10)
        radio.sendValue("DblCar", Address)
    }
})
let Address = 0
let SettingNumber = 0
let Gateway = 0
let uid = 0
let Status = 0
serial.writeLine("Start")
Status = 0
// Unset
basic.showLeds(`
    # # . # #
    . . . . .
    . # # # .
    # # # # #
    . # . # .
    `)
bitbot.setLedColor(0xff0000)
if (flashstorage.getOrDefault("Gateway", "NotSet") != "NotSet") {
    uid = randint(0, 9999999)
    Status = 2
    Gateway = parseFloat(flashstorage.getOrDefault("Gateway", "0"))
    bitbot.setLedColor(0x0000FF)
    radio.setGroup(Gateway * 10)
    serial.writeNumber(Gateway * 10)
    radio.sendValue("CarAwait", uid)
}
loops.everyInterval(5000, function () {
    if (Status == 2 || Status == 4) {
        radio.sendValue("CarAwait", uid)
    }
})
