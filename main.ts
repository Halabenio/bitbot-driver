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
        Status = 2
        bitbot.setLedColor(0x0000FF)
        radio.sendValue("CarAwait", 0)
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
    basic.showIcon(IconNames.Heart)
    if (name == "CarDispatch") {
        basic.showIcon(IconNames.Happy)
        Status = 3
        bitbot.setLedColor(0x18E600)
        radio.setGroup(Gateway * 10 + value)
        serial.writeNumber(Gateway * 10 + value)
        Address = Gateway * 10 + value
    } else if (name == "GatewayFull") {
        basic.showIcon(IconNames.Sad)
        Status = 4
        for (let index = 0; index < 8; index++) {
            bitbot.setPixelColor(0, 0xff0000)
            bitbot.ledRotate(true, BBArms.Both)
            bitbot.ledRotate(true, BBArms.Both)
        }
    } else if (name == "IsCar") {
        radio.sendValue("CarHere", 0)
    } else if (name == "DrivePacket") {
        bitbot.move(BBMotor.Left, BBDirection.Forward, parseFloat(convertToText(value).substr(0, 3)))
        bitbot.move(BBMotor.Right, BBDirection.Forward, parseFloat(convertToText(value).substr(3, 3)))
        radio.sendValue("Driving", 0)
    } else if (name == "CarHere") {
        radio.setGroup(Gateway * 10)
        radio.sendValue("DoubleCar", Address)
    }
})
let Address = 0
let SettingNumber = 0
let Gateway = 0
let Status = 0
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
    Status = 2
    Gateway = parseFloat(flashstorage.getOrDefault("Gateway", "0"))
    bitbot.setLedColor(0x0000FF)
    radio.setGroup(Gateway * 10)
    serial.writeNumber(Gateway * 10)
    radio.sendValue("CarAwait", 0)
}
loops.everyInterval(500, function () {
    if (Status == 2 || Status == 4) {
        radio.sendValue("CarAwait", 0)
    }
})
