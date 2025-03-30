import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4'>
      <div className='container mx-auto px-4 flex flex-col md:flex-row items-center justify-between'>
        {/* Logo & Branding */}
        <div className='flex items-center space-x-2 mb-3 md:mb-0'>
          <img src='logo512.png' alt='Logo' className='h-8 w-auto' />
          <span className='text-lg font-bold'>Meeting Room</span>
        </div>

        {/* Social Icons */}
        <div className='flex space-x-4 mb-3 md:mb-0'>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-gray-200 transition'
          >
            <Facebook size={18} />
          </a>
          <a
            href='https://twitter.com'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-gray-200 transition'
          >
            <Twitter size={18} />
          </a>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-gray-200 transition'
          >
            <Instagram size={18} />
          </a>
        </div>

        {/* Copyright */}
        <p className='text-xs'>
          &copy; {new Date().getFullYear()} MeetingRoomBooking.
        </p>
      </div>
    </footer>
  );
}
