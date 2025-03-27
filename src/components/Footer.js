import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className='bg-teal-600 text-white py-4'>
      <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center'>
        {/* Logo*/}
        <h2 className='text-lg font-semibold'>#####</h2>

        {/* Mạng xã hội */}
        <div className='flex space-x-4'>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-blue-400 transition'
          >
            <Facebook size={18} />
          </a>
          <a
            href='https://twitter.com'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-blue-300 transition'
          >
            <Twitter size={18} />
          </a>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-pink-400 transition'
          >
            <Instagram size={18} />
          </a>
        </div>

        {/* Bản quyền */}
        <p className='text-xs mt-2 md:mt-0'>
          &copy; {new Date().getFullYear()} Đặt Phòng Họp
        </p>
      </div>
    </footer>
  );
}
