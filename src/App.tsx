import viteLogo from '/vite.svg'
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

// @ts-ignore
function App({signOut}: any) {

  return (
    <View className="App">
      <Card>
        <Image src={viteLogo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  )
}

export default withAuthenticator(App);