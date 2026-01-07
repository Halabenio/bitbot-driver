enum RadioMessage {
    message1 = 49434,
    Occupied = 8782,
    CarKeepalive = 29201,
    ControllerKeepalive = 30085
}
radio.onReceivedMessage(RadioMessage.CarKeepalive, function () {
    bitbot.setLedColor(0xFF0000)
    if (LastKeepalive <= 25) {
        LastKeepalive = 50
        Connected = -1
        music.play(music.stringPlayable("F C5 - - - - - - ", 500), music.PlaybackMode.InBackground)
    }
})
radio.onReceivedMessage(RadioMessage.ControllerKeepalive, function () {
    bitbot.setLedColor(0xFFFF00)
    if (LastKeepalive <= 25) {
        LastKeepalive = 50
        Connected = -1
    }
})
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
input.onButtonPressed(Button.AB, function () {
    music.play(music.stringPlayable("E C F - - C5 - - ", 500), music.PlaybackMode.InBackground)
    Connected = 0
    bitbot.ledRainbow(true, BBArms.Left)
    bitbot.ledRainbow(false, BBArms.Right)
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
music.play(music.stringPlayable("C E G - - - - - ", 500), music.PlaybackMode.InBackground)
loops.everyInterval(10, function () {
    if (Connected == -1) {
        LastKeepalive += -1
        if (LastKeepalive <= 0) {
            bitbot.setLedColor(0xFF00FF)
        }
    } else if (Connected == 1) {
        LastKeepalive += -1
        if (LastKeepalive <= 0) {
            Connected = 0
            bitbot.ledRainbow(true, BBArms.Left)
            bitbot.ledRainbow(false, BBArms.Right)
        }
    }
})
basic.forever(function () {
    if (Connected == 0) {
        radio.sendMessage(RadioMessage.CarKeepalive)
        bitbot.ledRotate(false, BBArms.Both)
    }
})
