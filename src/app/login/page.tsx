import { Center } from '@/components/ui/center';
import Image from 'next/image';
import { 
    Button,
    ButtonText,
} from '@/components/ui/button';






export default function login() {

    return (
        <Center className='h-screen'>
            <Image 
            src="/homeVital.svg" 
            alt='HomeVital logo' 
            width={200}
            height={200}
            />
            <Button size='lg' className='mt-20'>
                <ButtonText>Innskráning</ButtonText>
            </Button>

    
        </Center>
    );
}