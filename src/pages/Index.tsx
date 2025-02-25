
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Website Into a <br />
              <span className="text-primary">WhatsApp Marketing Tool</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Engage your website visitors through WhatsApp and convert them into customers with automated conversations.
            </p>
            <Link to="/signup">
              <Button size="lg" className="hover-scale">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 hover-scale">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const features = [
  {
    title: "WhatsApp Marketing",
    description: "Engage your customers through WhatsApp with automated conversations and personalized messages.",
  },
  {
    title: "Campaign Management",
    description: "Create and manage multiple marketing campaigns with detailed analytics and tracking.",
  },
  {
    title: "Automated Responses",
    description: "Set up automated responses to common queries and save time while maintaining engagement.",
  },
];

export default Index;
