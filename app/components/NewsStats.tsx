import { allNews, newsSources } from '@/app/lib/newsService';

export default function NewsStats() {
  // Calculate statistics for HRDCorp news only
  const totalNews = allNews.length;
  const sourceStats = Object.keys(newsSources).map(source => ({
    source,
    count: allNews.filter(item => item.source === source).length,
    name: newsSources[source as keyof typeof newsSources].name
  })).filter(stat => stat.count > 0); // Only show sources with actual news

  const categoryStats = [
    { category: 'training', name: 'Training & Development', count: allNews.filter(item => item.category === 'training').length },
    { category: 'policy', name: 'Policy & Regulations', count: allNews.filter(item => item.category === 'policy').length }
  ].filter(stat => stat.count > 0); // Only show categories with actual news

  const priorityStats = [
    { priority: 'high', name: 'High Priority', count: allNews.filter(item => item.priority === 'high').length },
    { priority: 'medium', name: 'Medium Priority', count: allNews.filter(item => item.priority === 'medium').length },
    { priority: 'low', name: 'Low Priority', count: allNews.filter(item => item.priority === 'low').length }
  ].filter(stat => stat.count > 0); // Only show priorities with actual news

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            HRDCorp News Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Overview of HRDCorp news coverage and distribution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total News Count */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">{totalNews}</div>
            <div className="text-blue-100">Total Articles</div>
          </div>

          {/* High Priority News */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">
              {allNews.filter(item => item.priority === 'high').length}
            </div>
            <div className="text-red-100">High Priority</div>
          </div>

          {/* Training News */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">
              {allNews.filter(item => item.category === 'training').length}
            </div>
            <div className="text-green-100">Training News</div>
          </div>

          {/* Policy News */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">
              {allNews.filter(item => item.category === 'policy').length}
            </div>
            <div className="text-purple-100">Policy News</div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* Category Distribution */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">News by Category</h3>
            <div className="space-y-3">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                  <span className="text-sm font-bold text-gray-900">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">News by Priority</h3>
            <div className="space-y-3">
              {priorityStats.map((stat) => (
                <div key={stat.priority} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                  <span className="text-sm font-bold text-gray-900">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 