\@@print{Write your T code in this box. Then write command "run" in the terminal simulator below and press enter.}
\@@print{Use command "clear" to clear the terminal simulator}
\@@print{You can also choose from sample codes above and run and edit them if you want.}
\% This is a comment
\% Declare a variable \myVariable
\@@let \myVariable >\@@string{This is myVariable}
\% ">" is needed to tell the interpreter to execute following command. ">" is only needed with \@@let
\% Using \@@let without ">" would assign variable to object immediately following. e.g.
\@@let \mySecondVariable \@@string
\% makes \mySecondVariable to be the command \@@string which means that strings can now be made using \mySecondVariable
\@@let \myString >\mySecondVariable{Hello from string}
\% Let's print \myVariable and \myString
\@@print{myVariable is: "\myVariable", myString is "\myString".}