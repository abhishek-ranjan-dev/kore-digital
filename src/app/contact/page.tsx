import type { Metadata } from 'next';
import Header from '@/components/Header';
import ContactUs from '@/components/ContactUs';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Kore Digital Limited. Email us at cs@koredigital.com or visit our corporate office at Shelton Sapphire, CBD Belapur, Navi Mumbai.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactUs />
      <Footer />
    </>
  );
}
