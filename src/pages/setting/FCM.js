import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import  {Button} from "../../components/ui/button"
import  {Input}  from '../../components/ui/input';
import  {useToast}  from '../../hooks/use-toast';
import TokenCard from '../../components/TokenCard';
import TokenModal from '../../components/TokenModal';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { motion } from "framer-motion";
const Index = () => {
  const [tokens, setTokens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState(null);
  const [deleteToken, setDeleteToken] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedTokens = localStorage.getItem('fcmTokens');
    if (savedTokens) {
      setTokens(JSON.parse(savedTokens));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fcmTokens', JSON.stringify(tokens));
  }, [tokens]);

  const handleAddToken = (tokenData) => {
    const newToken = {
      id: Date.now().toString(),
      ...tokenData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTokens(prev => [newToken, ...prev]);
    setIsModalOpen(false);
    toast({
      title: "Success!",
      description: "FCM token added successfully.",
    });
  };

  const handleEditToken = (tokenData) => {
    setTokens(prev => prev.map(token => 
      token.id === editingToken.id 
        ? { ...token, ...tokenData, updatedAt: new Date().toISOString() }
        : token
    ));
    setEditingToken(null);
    setIsModalOpen(false);
    toast({
      title: "Success!",
      description: "FCM token updated successfully.",
    });
  };

  const handleDeleteToken = () => {
    setTokens(prev => prev.filter(token => token.id !== deleteToken.id));
    setDeleteToken(null);
    toast({
      title: "Deleted!",
      description: "FCM token deleted successfully.",
      variant: "destructive",
    });
  };

  const openEditModal = (token) => {
    setEditingToken(token);
    setIsModalOpen(true);
  };

  const filteredTokens = tokens.filter(token =>
   
    token.token.toLowerCase().includes(searchTerm.toLowerCase()) 
   
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
       <motion.div
      className="text-center mb-15"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
        FCM Token Manager
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Manage your Firebase Cloud Messaging tokens with ease. Add, edit, and organize your FCM tokens in one beautiful interface.
      </p>
    </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Token
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">{tokens.length}</div>
            <div className="text-gray-600">Total Tokens</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-2">{tokens.filter(t => t.status === 'active').length}</div>
            <div className="text-gray-600">Active Tokens</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">{filteredTokens.length}</div>
            <div className="text-gray-600">Filtered Results</div>
          </div>
        </div>

        {/* Token List */}
        {filteredTokens.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔑</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {tokens.length === 0 ? 'No tokens yet' : 'No matching tokens'}
              </h3>
              <p className="text-gray-500 mb-6">
                {tokens.length === 0 
                  ? 'Get started by adding your first FCM token'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {tokens.length === 0 && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Token
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTokens.map((token, index) => (
              <TokenCard
                key={token.id}
                token={token}
                onEdit={openEditModal}
                onDelete={setDeleteToken}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <TokenModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingToken(null);
          }}
          onSave={editingToken ? handleEditToken : handleAddToken}
          editingToken={editingToken}
        />

        <DeleteConfirmation
          isOpen={!!deleteToken}
          onClose={() => setDeleteToken(null)}
          onConfirm={handleDeleteToken}
         
        />
      </div>
    </div>
  );
};

export default Index;
