import{
   Html,
   Head,
   Font,
   Preview,
   Section,
   Text
}from '@react-email/components';

interface VerificationEmailProps{
   username: string;
   otp: string;
}
export default function VerificationEmail({
   username, otp}: VerificationEmailProps){
    return(
        <Html lang="en" dir='ltr'>
            <Head>
               <title>Verification Email</title>
                <Font
                fallbackFontFamily="sans-serif"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                />
            </Head>
            <Preview>Here is your verification code:{otp}</Preview>
            <Section>
                <Text>
                    Hi {username}, here is your verification code: {otp}
                </Text>
            </Section>
        </Html>
    )
   }