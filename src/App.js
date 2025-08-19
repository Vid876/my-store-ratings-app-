import React, { useState, useMemo } from 'react';
import axios from 'axios'; 
import { ShieldCheck, User, Building, Star, LogOut, PlusCircle, Search, ChevronUp, ChevronDown } from 'lucide-react';

// --- MOCK DATA --- //
// Note: In a real app, this data would be fetched from the backend.
const initialUsers = [
  { id: 1, name: 'Administrator Prime', email: 'admin@example.com', password: 'Password@1', address: '123 Cybertron Lane', role: 'System Administrator' },
  { id: 2, name: 'John Everyman', email: 'user@example.com', password: 'Password@2', address: '456 Suburbia Street', role: 'Normal User' },
  { id: 3, name: 'Brenda Owner', email: 'owner@example.com', password: 'Password@3', address: '789 Commerce Avenue', role: 'Store Owner' },
  { id: 4, name: 'Another User', email: 'user2@example.com', password: 'Password@4', address: '101 Maple Drive', role: 'Normal User' },
];

const initialStores = [
  { id: 1, name: 'The Grand Gadgetarium', email: 'contact@gadgetarium.com', address: '1 Tech Plaza', owner_id: 3 },
  { id: 2, name: 'Super Grocer', email: 'support@supergrocer.com', address: '25 Market Street', owner_id: null },
  { id: 3, name: 'Bookworm\'s Paradise', email: 'info@bookworm.com', address: '50 Library Lane', owner_id: null },
  { id: 4, name: 'Fashion Forward Boutique', email: 'style@fashion.com', address: '8 Fashion Row', owner_id: null },
];

const initialRatings = [
  { id: 1, user_id: 2, store_id: 1, rating: 5 },
  { id: 2, user_id: 4, store_id: 1, rating: 4 },
  { id: 3, user_id: 2, store_id: 2, rating: 3 },
  { id: 4, user_id: 4, store_id: 3, rating: 5 },
];

// --- HELPER & UI COMPONENTS --- //

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    {icon}
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- PAGE & FEATURE COMPONENTS --- //

const LoginPage = ({ handleLogin, loginError, setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Store Ratings</h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" type="email" placeholder="Email (e.g., admin@example.com)" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" type="password" placeholder="Password (e.g., Password@1)" value={password} onChange={e => setPassword(e.target.value)} required />
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type="submit">Login</button>
        </form>
        <p className="text-center text-gray-600">
          Don't have an account? <button onClick={() => setCurrentPage('register')} className="font-medium text-blue-600 hover:text-blue-500">Sign up</button>
        </p>
      </div>
    </div>
  );
};

const RegisterPage = ({ handleRegister, setCurrentPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (name.length < 5 || name.length > 20) { setError('Name must be between 5 and 20 characters.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 8 || password.length > 16 || !/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/.test(password)) { setError('Password must be 8-16 characters with one uppercase letter and one special character.'); return; }
    if (address.length > 400) { setError('Address must be less than 400 characters.'); return; }
    handleRegister({ name, email, password, address });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create an Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input className="w-full px-4 py-2 border rounded-lg" type="text" placeholder="Full Name (5-20 characters)" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-lg" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-lg" type="password" placeholder="Password (8-16 chars, 1 uppercase, 1 special)" value={password} onChange={e => setPassword(e.target.value)} required />
          <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Address (max 400 characters)" value={address} onChange={e => setAddress(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700" type="submit">Register</button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account? <button onClick={() => setCurrentPage('login')} className="font-medium text-blue-600 hover:text-blue-500">Log in</button>
        </p>
      </div>
    </div>
  );
};

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('Normal User');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password || !role) { setError('Please fill all required fields.'); return; }
        onAddUser({ name, email, password, address, role });
        setName(''); setEmail(''); setPassword(''); setAddress(''); setRole('Normal User');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full px-4 py-2 border rounded-lg" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <input className="w-full px-4 py-2 border rounded-lg" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="w-full px-4 py-2 border rounded-lg" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                <select className="w-full px-4 py-2 border rounded-lg bg-white" value={role} onChange={e => setRole(e.target.value)} required>
                    <option value="Normal User">Normal User</option>
                    <option value="Store Owner">Store Owner</option>
                    <option value="System Administrator">System Administrator</option>
                </select>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add User</button>
                </div>
            </form>
        </Modal>
    );
};

const AddStoreModal = ({ isOpen, onClose, onAddStore, users }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [error, setError] = useState('');

    const storeOwners = users.filter(u => u.role === 'Store Owner');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email) { setError('Name and Email are required.'); return; }
        onAddStore({ name, email, address, owner_id: ownerId ? parseInt(ownerId) : null });
        setName(''); setEmail(''); setAddress(''); setOwnerId('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Store">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full px-4 py-2 border rounded-lg" type="text" placeholder="Store Name" value={name} onChange={e => setName(e.target.value)} required />
                <input className="w-full px-4 py-2 border rounded-lg" type="email" placeholder="Contact Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                <select className="w-full px-4 py-2 border rounded-lg bg-white" value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                    <option value="">No Owner (Unassigned)</option>
                    {storeOwners.map(owner => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
                </select>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Store</button>
                </div>
            </form>
        </Modal>
    );
};

const AdminDashboard = ({ currentUser, handleLogout, users, stores, ratings, storeRatings, handleAddUser, handleAddStore }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [userFilter, setUserFilter] = useState({ name: '', email: '', address: '', role: '' });
    const [storeFilter, setStoreFilter] = useState({ name: '', email: '', address: '' });
    const [userSort, setUserSort] = useState({ key: 'name', order: 'asc' });
    const [storeSort, setStoreSort] = useState({ key: 'name', order: 'asc' });
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isStoreModalOpen, setStoreModalOpen] = useState(false);

    const handleUserSort = (key) => setUserSort(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
    const handleStoreSort = (key) => setStoreSort(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));

    const filteredUsers = useMemo(() => [...users]
        .filter(u => 
            u.name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
            u.email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
            (u.address || '').toLowerCase().includes(userFilter.address.toLowerCase()) &&
            (userFilter.role === '' || u.role === userFilter.role)
        )
        .sort((a, b) => {
            if (a[userSort.key] < b[userSort.key]) return userSort.order === 'asc' ? -1 : 1;
            if (a[userSort.key] > b[userSort.key]) return userSort.order === 'asc' ? 1 : -1;
            return 0;
        }), [users, userFilter, userSort]);

    const filteredStores = useMemo(() => [...stores]
        .filter(s => 
            s.name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
            s.email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
            (s.address || '').toLowerCase().includes(storeFilter.address.toLowerCase())
        )
        .sort((a, b) => {
            if (a[storeSort.key] < b[storeSort.key]) return storeSort.order === 'asc' ? -1 : 1;
            if (a[storeSort.key] > b[storeSort.key]) return storeSort.order === 'asc' ? 1 : -1;
            return 0;
        }), [stores, storeFilter, storeSort]);
        
    const SortIcon = ({ sortKey, currentSort }) => {
        if (sortKey !== currentSort.key) return null;
        return currentSort.order === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />;
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{currentUser.name}</span>
                    <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <LogOut size={18} /><span>Logout</span>
                    </button>
                </div>
            </header>
            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={<User size={32} className="text-blue-500" />} title="Total Users" value={users.length} color="border-blue-500" />
                    <StatCard icon={<Building size={32} className="text-green-500" />} title="Total Stores" value={stores.length} color="border-green-500" />
                    <StatCard icon={<Star size={32} className="text-yellow-500" />} title="Total Ratings" value={ratings.length} color="border-yellow-500" />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button onClick={() => setActiveTab('users')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Manage Users</button>
                            <button onClick={() => setActiveTab('stores')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stores' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Manage Stores</button>
                        </nav>
                    </div>
                    {activeTab === 'users' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">User List</h3>
                                <button onClick={() => setUserModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><PlusCircle size={18} /><span>Add User</span></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                <input type="text" placeholder="Filter by Name..." className="px-3 py-2 border rounded-md" value={userFilter.name} onChange={e => setUserFilter({...userFilter, name: e.target.value})} />
                                <input type="text" placeholder="Filter by Email..." className="px-3 py-2 border rounded-md" value={userFilter.email} onChange={e => setUserFilter({...userFilter, email: e.target.value})} />
                                <input type="text" placeholder="Filter by Address..." className="px-3 py-2 border rounded-md" value={userFilter.address} onChange={e => setUserFilter({...userFilter, address: e.target.value})} />
                                <select className="px-3 py-2 border rounded-md bg-white" value={userFilter.role} onChange={e => setUserFilter({...userFilter, role: e.target.value})}>
                                    <option value="">All Roles</option>
                                    <option value="System Administrator">System Administrator</option>
                                    <option value="Normal User">Normal User</option>
                                    <option value="Store Owner">Store Owner</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleUserSort('name')}>Name <SortIcon sortKey="name" currentSort={userSort} /></th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleUserSort('email')}>Email <SortIcon sortKey="email" currentSort={userSort} /></th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleUserSort('role')}>Role <SortIcon sortKey="role" currentSort={userSort} /></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6 whitespace-nowrap">{user.name}</td>
                                                <td className="py-4 px-6 whitespace-nowrap">{user.email}</td>
                                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{user.address}</td>
                                                <td className="py-4 px-6 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'System Administrator' ? 'bg-red-100 text-red-800' : user.role === 'Store Owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'stores' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Store List</h3>
                                <button onClick={() => setStoreModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><PlusCircle size={18} /><span>Add Store</span></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                <input type="text" placeholder="Filter by Name..." className="px-3 py-2 border rounded-md" value={storeFilter.name} onChange={e => setStoreFilter({...storeFilter, name: e.target.value})} />
                                <input type="text" placeholder="Filter by Email..." className="px-3 py-2 border rounded-md" value={storeFilter.email} onChange={e => setStoreFilter({...storeFilter, email: e.target.value})} />
                                <input type="text" placeholder="Filter by Address..." className="px-3 py-2 border rounded-md" value={storeFilter.address} onChange={e => setStoreFilter({...storeFilter, address: e.target.value})} />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleStoreSort('name')}>Name <SortIcon sortKey="name" currentSort={storeSort} /></th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleStoreSort('email')}>Email <SortIcon sortKey="email" currentSort={storeSort} /></th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredStores.map(store => (
                                            <tr key={store.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6 whitespace-nowrap">{store.name}</td>
                                                <td className="py-4 px-6 whitespace-nowrap">{store.email}</td>
                                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{store.address}</td>
                                                <td className="py-4 px-6 whitespace-nowrap flex items-center">
                                                    <Star className="text-yellow-400 mr-1" size={16} fill="currentColor" /> 
                                                    {storeRatings[store.id]?.average || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <AddUserModal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} onAddUser={handleAddUser} />
            <AddStoreModal isOpen={isStoreModalOpen} onClose={() => setStoreModalOpen(false)} onAddStore={handleAddStore} users={users} />
        </div>
    );
};

const UserDashboard = ({ currentUser, handleLogout, stores, ratings, storeRatings, handleRateStore }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StarRating = ({ storeId, userRating, onRate }) => {
        const [hoverRating, setHoverRating] = useState(0);
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={24}
                        className={`cursor-pointer transition-colors ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={star <= (hoverRating || userRating) ? 'currentColor' : 'none'}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => onRate(storeId, star)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Browse Stores</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{currentUser.name}</span>
                    <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <LogOut size={18} /><span>Logout</span>
                    </button>
                </div>
            </header>
            <main className="p-8">
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for stores by Name or Address..."
                            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map(store => {
                        const userRating = ratings.find(r => r.user_id === currentUser.id && r.store_id === store.id)?.rating || 0;
                        return (
                            <div key={store.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{store.name}</h3>
                                    <p className="text-gray-500 mt-1">{store.address}</p>
                                    <div className="flex items-center mt-4 text-gray-700">
                                        <Star className="text-yellow-400 mr-2" size={20} fill="currentColor" />
                                        <span className="font-semibold">{storeRatings[store.id]?.average}</span>
                                        <span className="text-sm text-gray-500 ml-1">({storeRatings[store.id]?.count} ratings)</span>
                                    </div>
                                </div>
                                <div className="mt-6 border-t pt-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">{userRating > 0 ? 'You rated:' : 'Rate this store:'}</p>
                                    <StarRating storeId={store.id} userRating={userRating} onRate={handleRateStore} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};
  
const StoreOwnerDashboard = ({ currentUser, handleLogout, stores, users, storeRatings }) => {
    const myStore = stores.find(s => s.owner_id === currentUser.id);

    if (!myStore) {
        return (
             <div className="bg-gray-100 min-h-screen">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                    <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <LogOut size={18} /><span>Logout</span>
                    </button>
                </header>
                <main className="p-8 text-center">
                    <p className="text-xl text-gray-600">You are not currently assigned as an owner to any store.</p>
                </main>
            </div>
        )
    }

    const myStoreRatings = storeRatings[myStore.id];
    const raters = myStoreRatings.ratings.map(rating => {
        const user = users.find(u => u.id === rating.user_id);
        return { ...rating, userName: user ? user.name : 'Unknown User' };
    });

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">{myStore.name} - Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{currentUser.name}</span>
                    <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <LogOut size={18} /><span>Logout</span>
                    </button>
                </div>
            </header>
            <main className="p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Store Performance</h2>
                    <div className="flex items-center justify-center bg-blue-50 p-6 rounded-lg mb-8">
                        <p className="text-lg text-gray-600 mr-4">Average Rating:</p>
                        <div className="flex items-center">
                            <Star className="text-yellow-400 mr-2" size={32} fill="currentColor" />
                            <span className="text-4xl font-bold text-blue-600">{myStoreRatings.average}</span>
                            <span className="text-gray-500 ml-2">from {myStoreRatings.count} ratings</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Users Who Rated Your Store</h3>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {raters.map(rater => (
                                    <tr key={rater.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 whitespace-nowrap">{rater.userName}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {Array(rater.rating).fill(0).map((_, i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}
                                                {Array(5 - rater.rating).fill(0).map((_, i) => <Star key={i} size={16} className="text-gray-300" />)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- MAIN APP COMPONENT --- //

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loginError, setLoginError] = useState('');

  // Fetch data from backend when component mounts
  React.useEffect(() => {
    // Using mock data for now as backend is separate
    setUsers(initialUsers);
    setStores(initialStores);
    setRatings(initialRatings);
    
    
    // REAL BACKEND CODE
    axios.get('http://localhost:5001/api/stores')
      .then(res => setStores(res.data))
      .catch(err => console.error("Could not fetch stores", err));
      
    axios.get('http://localhost:5001/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Could not fetch users", err));

    axios.get('http://localhost:5001/api/ratings')
      .then(res => setRatings(res.data))
      .catch(err => console.error("Could not fetch ratings", err));
    
  }, []);

  const storeRatings = useMemo(() => {
    const ratingsByStore = {};
    stores.forEach(store => {
      const storeRatings = ratings.filter(r => r.store_id === store.id);
      const total = storeRatings.reduce((acc, r) => acc + r.rating, 0);
      const average = storeRatings.length > 0 ? (total / storeRatings.length).toFixed(1) : 'N/A';
      ratingsByStore[store.id] = { ratings: storeRatings, average, count: storeRatings.length };
    });
    return ratingsByStore;
  }, [ratings, stores]);

  const handleLogin = (email, password) => {
    setLoginError('');
    // Using mock login for now
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      switch (user.role) {
        case 'System Administrator': setCurrentPage('adminDashboard'); break;
        case 'Normal User': setCurrentPage('userDashboard'); break;
        case 'Store Owner': setCurrentPage('storeOwnerDashboard'); break;
        default: setCurrentPage('login');
      }
    } else {
      setLoginError('Invalid email or password.');
    }

    
    // REAL BACKEND CODE
    axios.post('http://localhost:5001/api/login', { email, password })
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setCurrentUser(user);
        switch (user.role) {
          case 'System Administrator': setCurrentPage('adminDashboard'); break;
          case 'Normal User': setCurrentPage('userDashboard'); break;
          case 'Store Owner': setCurrentPage('storeOwnerDashboard'); break;
          default: setCurrentPage('login');
        }
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || "An error occurred during login.";
        setLoginError(errorMsg);
        console.error(err);
      });

  };

  const handleRegister = (userData) => {
    // Using mock register for now
    if (users.some(u => u.email === userData.email)) {
        alert("An account with this email already exists.");
        return;
    }
    const newUser = { id: users.length + 1, ...userData, role: 'Normal User' };
    setUsers(prev => [...prev, newUser]);
    alert("Registration successful! Please log in.");
    setCurrentPage('login');
    
    
    // REAL BACKEND CODE
    axios.post('http://localhost:5001/api/register', userData)
      .then(res => {
        alert("Registration successful! Please log in.");
        setCurrentPage('login');
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || "An error occurred during registration.";
        alert("Error: " + errorMsg);
        console.error(err);
      });
    
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    // localStorage.removeItem('token');
  };

  const handleAddUser = (userData) => {
    if (users.some(u => u.email === userData.email)) {
        alert("An account with this email already exists.");
        return;
    }
    const newUser = { id: users.length + 1, ...userData };
    setUsers(prev => [...prev, newUser]);
  };

  const handleAddStore = (storeData) => {
    const newStore = { id: stores.length + 1, ...storeData };
    setStores(prev => [...prev, newStore]);
  };

  const handleRateStore = (storeId, rating) => {
    setRatings(prevRatings => {
        const existingRatingIndex = prevRatings.findIndex(r => r.user_id === currentUser.id && r.store_id === storeId);
        if (existingRatingIndex > -1) {
            const updatedRatings = [...prevRatings];
            updatedRatings[existingRatingIndex] = { ...updatedRatings[existingRatingIndex], rating };
            return updatedRatings;
        } else {
            const newRating = { id: prevRatings.length + 1, user_id: currentUser.id, store_id: storeId, rating };
            return [...prevRatings, newRating];
        }
    });
  };

  switch (currentPage) {
    case 'register':
      return <RegisterPage handleRegister={handleRegister} setCurrentPage={setCurrentPage} />;
    case 'adminDashboard':
      return <AdminDashboard currentUser={currentUser} handleLogout={handleLogout} users={users} stores={stores} ratings={ratings} storeRatings={storeRatings} handleAddUser={handleAddUser} handleAddStore={handleAddStore} />;
    case 'userDashboard':
      return <UserDashboard currentUser={currentUser} handleLogout={handleLogout} stores={stores} ratings={ratings} storeRatings={storeRatings} handleRateStore={handleRateStore} />;
    case 'storeOwnerDashboard':
      return <StoreOwnerDashboard currentUser={currentUser} handleLogout={handleLogout} stores={stores} users={users} storeRatings={storeRatings} />;
    case 'login':
    default:
      return <LoginPage handleLogin={handleLogin} loginError={loginError} setCurrentPage={setCurrentPage} />;
  }
}
