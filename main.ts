enum RadioMessage {
    message1 = 49434,
    Occupied = 8782
}
input.onButtonPressed(Button.A, function () {
    Connected = -1
    if (Channel > 0) {
        Channel += -1
    } else {
        Channel = 9
    }
    basic.showNumber(Channel)
    radio.setGroup(40 + Channel)
    bitbot.setLedColor(0xFF00FF)
})
radio.onReceivedMessage(RadioMessage.Occupied, function () {
    bitbot.setLedColor(0xFF0000)
    LastKeepalive = 100
    Connected = -1
})
input.onButtonPressed(Button.AB, function () {
    Connected = 0
    bitbot.ledRainbow(true, BBArms.Both)
})
input.onButtonPressed(Button.B, function () {
    Connected = -1
    if (Channel < 9) {
        Channel += 1
    } else {
        Channel = 0
    }
    basic.showNumber(Channel)
    radio.setGroup(40 + Channel)
    bitbot.setLedColor(0xFF00FF)
})
let LastKeepalive = 0
let Channel = 0
let Connected = 0
Connected = -1
Channel = 0
basic.showNumber(Channel)
radio.setGroup(40)
bitbot.setLedColor(0xFF00FF)
loops.everyInterval(10, function () {
    if (Connected == -1) {
        LastKeepalive += -1
        if (LastKeepalive <= 0) {
            bitbot.setLedColor(0xFF00FF)
        }
    }
})
basic.forever(function () {
    if (Connected == 0) {
        radio.sendMessage(RadioMessage.Occupied)
        bitbot.ledRotate(false, BBArms.Both)
    }
})
