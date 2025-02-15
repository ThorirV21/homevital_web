import { redirect } from 'next/navigation';

const ClientsPage = () => {
  redirect('/dashboard/clients/list');
};

export default ClientsPage;
