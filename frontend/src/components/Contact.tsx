import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function Contact() {
  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#eb0a1e] mt-1" />
                <div>
                  <p className="text-gray-600 mb-2">
                    For general inquiries and customer service
                  </p>
                  <a
                    href="mailto:CustomerService@toyotrack.com"
                    className="text-[#eb0a1e] hover:underline"
                  >
                    CustomerService@toyotrack.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#eb0a1e] mt-1" />
                <div>
                  <p className="text-gray-600 mb-2">
                    Available Monday - Friday, 9am - 5pm EST
                  </p>
                  <a
                    href="tel:+14446668888"
                    className="text-[#eb0a1e] hover:underline"
                  >
                    +1 444-(666)-8888
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Office Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#eb0a1e] mt-1" />
                <div>
                  <p className="text-gray-600">
                    ToyoTrack Finance Center
                    <br />
                    123 Toyota Drive
                    <br />
                    Automotive City, AC 12345
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-[#f5f5f5] rounded-lg">
          <h3 className="mb-2">Business Hours</h3>
          <div className="space-y-1 text-gray-600">
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
