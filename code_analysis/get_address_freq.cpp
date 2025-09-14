#include <iostream>
#include <fstream>
#include <set>
#include <algorithm>
#include <unordered_map>
#include <map>
using namespace std;

string get_first_address(string & data_line) {
	return data_line.substr(0, data_line.find_first_of(','));
}
string get_second_address(string & data_line) {
	int pos = data_line.find_first_of(',');
	return data_line.substr(pos + 1, data_line.size() - pos - 1);
}
int main() {
	unordered_map<string, int> address_map;
	ifstream fin;
	fin.open("./filtered_address.csv");
	string s;
	if (fin.is_open()) {
		getline(fin, s);
		while (!fin.eof()){
			getline(fin, s);
			int pos = s.find_first_of(',');
			address_map[s.substr(0, pos)]++;
			address_map[s.substr(pos + 1, s.size() - pos - 1)]++;
		}
	}
	cout << address_map.size() << endl;
	fin.close();
	
	//
	ofstream fout("filtered_address_freq_count.csv");
	fout << "address,count" << endl;
	for (auto iter = address_map.begin(); iter != address_map.end(); ++iter) {
		fout << iter->first << ',' << iter->second << endl;
	}
	fout.close();
	return 0;
} 
