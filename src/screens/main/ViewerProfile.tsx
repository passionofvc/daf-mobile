import React from 'react'
import {
  Container,
  Text,
  Screen,
  Avatar,
  Constants,
  Button,
  BottomSnap,
  Credential,
  Icon,
} from '@kancha/kancha-ui'
import TabAvatar from '../../navigators/components/TabAvatar'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useQuery } from '@apollo/react-hooks'
import { GET_VIEWER_CREDENTIALS } from '../../lib/graphql/queries'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'
import hexToRgba from 'hex-to-rgba'
import { SharedElement } from 'react-navigation-shared-element'

const SWITCH_IDENTITY = 'SWITCH_IDENTITY'

interface Props extends NavigationStackScreenProps {}

const ViewerProfile: React.FC<Props> & {
  navigationOptions: any
} = ({ navigation }) => {
  const { data, loading } = useQuery(GET_VIEWER_CREDENTIALS)
  const viewer = data && data.viewer
  const source =
    viewer && data.viewer.profileImage
      ? { source: { uri: viewer.profileImage } }
      : {}

  return (
    <Screen scrollEnabled background={'primary'}>
      {loading && (
        <Container padding flex={1}>
          <Container
            w={100}
            h={100}
            br={5}
            background={'secondary'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <ActivityIndicator size={'large'} />
          </Container>
          <Container marginTop>
            <Container h={23} br={5} background={'secondary'}></Container>
            <Container marginTop>
              <Container
                h={60}
                backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
                padding
                br={5}
              ></Container>
            </Container>
          </Container>
        </Container>
      )}

      {!loading && (
        <Container padding flex={1}>
          <Avatar
            {...source}
            type={'rounded'}
            size={100}
            address={viewer && viewer.did}
            gravatarType={'retro'}
            backgroundColor={'white'}
          />
          <Container marginTop>
            <Text type={Constants.TextTypes.H2} bold>
              {viewer && viewer.shortId}
            </Text>
            <Container marginTop>
              <Container
                backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
                padding
                br={5}
              >
                <Text textStyle={{ fontFamily: 'menlo' }} selectable>
                  {viewer && viewer.did}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
      )}
      <Container padding>
        {!loading && viewer && (
          <Container flexDirection={'row'}>
            <Text type={Constants.TextTypes.H3} bold>
              Credentials
            </Text>
            <Container marginLeft>
              <Button
                iconButton
                icon={
                  <Icon
                    color={Colors.BRAND}
                    icon={{ name: 'ios-add-circle', iconFamily: 'Ionicons' }}
                  />
                }
                onPress={() =>
                  navigation.navigate('IssueCredential', {
                    viewer: viewer,
                  })
                }
              />
            </Container>
          </Container>
        )}
        {!loading && viewer && viewer.credentialsReceived.length === 0 && (
          <Container marginTop>
            <Text type={Constants.TextTypes.Body}>
              Start issuing credentials to yourself and others. Try starting
              with a <Text bold>name</Text> credential to personalise this
              profile.
            </Text>
          </Container>
        )}
        {!loading && viewer && viewer.credentialsReceived.length > 0 && (
          <Container>
            <Container marginBottom>
              <Container marginTop>
                <Text type={Constants.TextTypes.Body}>
                  <Text bold>Received</Text> credentials are presented here as a
                  plain list for now. Some will be moved to the data explorer
                  tab where we can explore all of our data and connections.
                </Text>
              </Container>
            </Container>
            {viewer &&
              viewer.credentialsReceived &&
              viewer.credentialsReceived.map((credential: any) => {
                return (
                  <SharedElement
                    key={credential.hash + credential.rowId}
                    id={credential.hash + credential.rowId}
                  >
                    <Credential
                      onPress={() =>
                        navigation.navigate('Credential', {
                          credentials: [credential],
                          transitionIds: [credential.hash + credential.rowId],
                        })
                      }
                      background={'secondary'}
                      exp={credential.exp}
                      issuer={credential.iss}
                      subject={credential.sub}
                      fields={credential.fields}
                    />
                  </SharedElement>
                )
              })}
          </Container>
        )}
      </Container>
    </Screen>
  )
}

ViewerProfile.navigationOptions = ({ navigation }: any) => {
  return {
    headerRight: (
      <Button
        onPress={() => BottomSnap.to(1, SWITCH_IDENTITY)}
        icon={<TabAvatar />}
        iconButton
      />
    ),
  }
}

export default ViewerProfile
