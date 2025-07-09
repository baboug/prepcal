import { Body, Container, Font, Head, Html, Img, Link, Preview, Section, Tailwind } from "@react-email/components";

interface EmailWrapperProps {
  children: React.ReactNode;
  preview: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const EmailWrapper = ({ children, preview }: EmailWrapperProps) => {
  return (
    <Html lang="en">
      <Head>
        <Font fallbackFontFamily="Arial" fontFamily="Plus Jakarta Sans" fontStyle="normal" fontWeight={400} />
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#e7e5e4] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Link href={baseUrl} rel="noopener noreferrer" target="_blank">
                <Img
                  alt="PrepCal"
                  className="mx-auto my-0"
                  height="48"
                  src={`${baseUrl}/static/logo.png`}
                  width="145"
                />
              </Link>
            </Section>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
